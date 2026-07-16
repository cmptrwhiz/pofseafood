import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  checkRateLimit,
  getClientIp,
  hasFilledHoneypot,
  verifyTurnstileToken,
} from "@/lib/request-guard";
import { sendVipConfirmationSms } from "@/lib/twilio";

const CONSENT_TEXT_VERSION = "v1.0";

const vipSubscribeSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(60),
  phone: z.string().trim().min(7, "Mobile number is required.").max(30),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .optional()
    .or(z.literal("")),
  smsConsent: z.boolean().refine((value) => value, {
    message: "SMS consent is required.",
  }),
  website: z.string().trim().max(200).optional().default(""),
  company: z.string().trim().max(200).optional().default(""),
  url: z.string().trim().max(200).optional().default(""),
  turnstileToken: z.string().trim().max(4096).optional().default(""),
});

function normalizeUsPhoneToE164(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  return null;
}

function normalizeEmail(email?: string | null) {
  const normalized = email?.trim().toLowerCase();
  return normalized || null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = vipSubscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check the VIP signup details.",
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
    const userAgent = headerStore.get("user-agent");

    const rateLimit = checkRateLimit({
      key: `vip-subscribe:${ip}`,
      limit: 5,
      windowMs: 10 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many signup attempts. Please try again shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

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

    const phone = normalizeUsPhoneToE164(parsed.data.phone);

    if (!phone) {
      return NextResponse.json(
        { error: "Enter a valid U.S. mobile number." },
        { status: 422 }
      );
    }

    const email = normalizeEmail(parsed.data.email);
    const consentTimestamp = new Date();

    const subscriber = await prisma.smsSubscriber.upsert({
      where: {
        phone,
      },
      update: {
        firstName: parsed.data.firstName,
        email,
        smsMarketingOptIn: true,
        consentTimestamp,
        consentSource: "vip_landing_page",
        consentTextVersion: CONSENT_TEXT_VERSION,
        ipAddress: ip,
        userAgent,
        status: "active",
        optOutTimestamp: null,
      },
      create: {
        firstName: parsed.data.firstName,
        phone,
        email,
        smsMarketingOptIn: true,
        consentTimestamp,
        consentSource: "vip_landing_page",
        consentTextVersion: CONSENT_TEXT_VERSION,
        ipAddress: ip,
        userAgent,
        status: "active",
      },
    });

    const smsResult = await sendVipConfirmationSms(phone);

    if (!smsResult.ok) {
      console.error("vip-confirmation-sms-failed", {
        subscriberId: subscriber.id,
        error: smsResult.error,
      });
    }

    return NextResponse.json({
      ok: true,
      subscriberId: subscriber.id,
      smsStatus: smsResult.status,
    });
  } catch (error) {
    console.error("vip-subscribe-failed", error);
    return NextResponse.json(
      { error: "Unable to join the VIP list right now." },
      { status: 400 }
    );
  }
}
