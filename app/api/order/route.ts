import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const headerStore = await headers();
    const forwardedFor = headerStore.get("x-forwarded-for");
    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      headerStore.get("x-real-ip") ||
      "unknown";

    const payload = {
      ...body,
      compliance: {
        capturedAt: new Date().toISOString(),
        ip,
        userAgent: headerStore.get("user-agent") || "unknown",
      },
    };

    // Lightweight placeholder for future POS / SMS / CRM automation wiring.
    console.log("order-capture", JSON.stringify(payload));

    const smsConsent = Boolean(body?.consents?.sms);

    return NextResponse.json({
      ok: true,
      automation: {
        orderReceivedSmsQueued: smsConsent,
        readySmsEligible: smsConsent,
        promoSmsEligible: smsConsent,
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
