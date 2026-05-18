import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const merchantId =
      payload?.merchantId ||
      payload?.merchid ||
      payload?.merchant_id ||
      null;

    const connection = merchantId
      ? await prisma.merchantConnection.findUnique({
          where: {
            cloverMerchantId: String(merchantId),
          },
        })
      : null;

    if (connection) {
      await prisma.syncEvent.create({
        data: {
          merchantConnectionId: connection.id,
          source: "webhook",
          eventType: payload?.type || payload?.objectType || "unknown",
          payloadJson: payload,
          status: "received",
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("clover-webhook-failed", error);
    return NextResponse.json(
      { error: "Unable to process Clover webhook." },
      { status: 400 }
    );
  }
}
