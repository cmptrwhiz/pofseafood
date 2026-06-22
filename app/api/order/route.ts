import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { notifyRestaurantOfOrder } from "@/lib/order-notifications";
import {
  checkRateLimit,
  getClientIp,
  hasFilledHoneypot,
  verifyTurnstileToken,
} from "@/lib/request-guard";

const orderCaptureSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(80),
    phone: z.string().trim().min(7).max(30),
    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .optional()
      .nullable()
      .or(z.literal("")),
  }),
  consents: z
    .object({
      sms: z.boolean().optional().default(false),
      email: z.boolean().optional().default(false),
      textVersion: z.string().trim().max(80).optional().nullable(),
    })
    .optional()
    .default({}),
  order: z.object({
    fulfillmentType: z.string().trim().max(40).optional().default("pickup"),
    pickupTime: z.string().trim().max(80).optional().nullable(),
    total: z.number().finite().min(0).max(5000),
    items: z
      .array(
        z.object({
          name: z.string().trim().min(1).max(140),
          price: z.number().finite().min(0).max(1000),
          quantity: z.number().int().min(1).max(99),
        })
      )
      .min(1)
      .max(100),
  }),
  session: z
    .object({
      referrer: z.string().max(500).optional().nullable(),
      path: z.string().max(250).optional().nullable(),
      deviceType: z.string().max(40).optional().nullable(),
    })
    .optional()
    .nullable(),
  website: z.string().trim().max(200).optional().default(""),
  company: z.string().trim().max(200).optional().default(""),
  url: z.string().trim().max(200).optional().default(""),
  turnstileToken: z.string().trim().max(4096).optional().default(""),
});

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function normalizeEmail(email?: string | null) {
  const normalized = email?.trim().toLowerCase();
  return normalized || null;
}

function dollarsToCents(value: unknown) {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) {
    return 0;
  }

  return Math.round(amount * 100);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = orderCaptureSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid order details.",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    if (
      hasFilledHoneypot([
        parsed.data.website,
        parsed.data.company,
        parsed.data.url,
      ])
    ) {
      return NextResponse.json({ ok: true });
    }

    const headerStore = await headers();
    const ip = getClientIp(headerStore);
    const turnstile = await verifyTurnstileToken({
      token: parsed.data.turnstileToken,
      ip,
    });

    if (!turnstile.ok) {
      return NextResponse.json(
        { error: "Bot verification failed. Please refresh and try again." },
        { status: 403 }
      );
    }

    const rateLimit = checkRateLimit({
      key: `order:${ip}`,
      limit: 6,
      windowMs: 10 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many order attempts. Please try again shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const data = parsed.data;

    const customerName = data.customer.name;
    const customerPhone = data.customer.phone;
    const customerEmail = normalizeEmail(data.customer.email);
    const phoneNormalized = normalizePhone(customerPhone);

    if (phoneNormalized.length < 7) {
      return NextResponse.json(
        { error: "Enter a valid phone number." },
        { status: 422 }
      );
    }

    const smsConsent = Boolean(data.consents.sms);
    const emailConsent = Boolean(data.consents.email);
    const consentsJson = {
      sms: smsConsent,
      email: emailConsent,
      textVersion: data.consents.textVersion ?? null,
    };
    const sessionJson = data.session
      ? {
          referrer: data.session.referrer ?? null,
          path: data.session.path ?? null,
          deviceType: data.session.deviceType ?? null,
        }
      : Prisma.JsonNull;

    const payload = {
      ...data,
      consents: consentsJson,
      session: sessionJson === Prisma.JsonNull ? null : sessionJson,
      compliance: {
        capturedAt: new Date().toISOString(),
        ip,
        userAgent: headerStore.get("user-agent") || "unknown",
      },
    };

    const lead = await prisma.customerLead.upsert({
      where: {
        phoneNormalized,
      },
      update: {
        fullName: customerName,
        phoneRaw: customerPhone,
        email: customerEmail,
        emailNormalized: customerEmail,
        smsConsent,
        emailConsent,
        consentTextVersion: consentsJson.textVersion,
        lastSeenAt: new Date(),
      },
      create: {
        fullName: customerName,
        phoneRaw: customerPhone,
        phoneNormalized,
        email: customerEmail,
        emailNormalized: customerEmail,
        smsConsent,
        emailConsent,
        consentTextVersion: consentsJson.textVersion,
      },
    });

    const totalCents = dollarsToCents(data.order.total);

    const orderCapture = await prisma.orderCapture.create({
      data: {
        customerLeadId: lead.id,
        customerName,
        customerPhone,
        customerEmail,
        fulfillmentType: data.order.fulfillmentType,
        pickupTime: data.order.pickupTime || null,
        totalCents,
        itemsJson: data.order.items,
        consentsJson,
        sessionJson,
        complianceJson: payload.compliance,
      },
    });

    const notification = await notifyRestaurantOfOrder({
      orderId: orderCapture.id,
      customerName,
      customerPhone,
      customerEmail,
      fulfillmentType: data.order.fulfillmentType,
      pickupTime: data.order.pickupTime || null,
      totalCents,
      items: data.order.items,
    });

    const orderStatus =
      notification.status === "restaurant_notified"
        ? "restaurant_notified"
        : notification.status === "notification_failed"
          ? "notification_failed"
          : "captured";

    if (orderStatus !== orderCapture.status) {
      await prisma.orderCapture.update({
        where: {
          id: orderCapture.id,
        },
        data: {
          status: orderStatus,
          complianceJson: {
            ...payload.compliance,
            notification:
              notification.status === "notification_failed"
                ? { status: notification.status, error: notification.error }
                : { status: notification.status },
          },
        },
      });
    }

    if (!notification.ok) {
      console.error("order-notification-failed", {
        orderId: orderCapture.id,
        error: notification.error,
      });
    }

    console.log("order-capture", JSON.stringify(payload));

    return NextResponse.json({
      ok: true,
      orderId: orderCapture.id,
      leadId: lead.id,
      status: orderStatus,
      automation: {
        restaurantEmailSent: notification.status === "restaurant_notified",
        orderReceivedSmsQueued: smsConsent,
        readySmsEligible: smsConsent,
        promoSmsEligible: smsConsent || emailConsent,
      },
    });
  } catch (error) {
    console.error("order-capture-failed", error);
    return NextResponse.json(
      { error: "Unable to capture order details." },
      { status: 400 }
    );
  }
}
