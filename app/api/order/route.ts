import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
    const body = await req.json();
    const headerStore = await headers();
    const forwardedFor = headerStore.get("x-forwarded-for");
    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      headerStore.get("x-real-ip") ||
      "unknown";

    const customerName = String(body?.customer?.name || "").trim();
    const customerPhone = String(body?.customer?.phone || "").trim();
    const customerEmail = normalizeEmail(body?.customer?.email);
    const phoneNormalized = normalizePhone(customerPhone);

    if (!customerName || !phoneNormalized) {
      return NextResponse.json(
        { error: "Name and phone number are required." },
        { status: 400 }
      );
    }

    const smsConsent = Boolean(body?.consents?.sms);
    const emailConsent = Boolean(body?.consents?.email);

    const payload = {
      ...body,
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
        consentTextVersion: body?.consents?.textVersion || null,
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
        consentTextVersion: body?.consents?.textVersion || null,
      },
    });

    const orderCapture = await prisma.orderCapture.create({
      data: {
        customerLeadId: lead.id,
        customerName,
        customerPhone,
        customerEmail,
        fulfillmentType: String(body?.order?.fulfillmentType || "pickup"),
        pickupTime: body?.order?.pickupTime
          ? String(body.order.pickupTime)
          : null,
        totalCents: dollarsToCents(body?.order?.total),
        itemsJson: body?.order?.items || [],
        consentsJson: body?.consents || null,
        sessionJson: body?.session || null,
        complianceJson: payload.compliance,
      },
    });

    console.log("order-capture", JSON.stringify(payload));

    return NextResponse.json({
      ok: true,
      orderId: orderCapture.id,
      leadId: lead.id,
      automation: {
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
