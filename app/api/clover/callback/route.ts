import { NextResponse } from "next/server";
import {
  exchangeCloverCodeForToken,
  fetchCloverMerchantProfile,
} from "@/lib/clover";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const merchantIdFromQuery = url.searchParams.get("merchant_id");

  if (!code) {
    return NextResponse.json(
      { error: "Missing Clover OAuth code." },
      { status: 400 }
    );
  }

  try {
    const tokenResponse = await exchangeCloverCodeForToken(code);
    const cloverMerchantId =
      merchantIdFromQuery ?? tokenResponse.merchant_id ?? "";

    if (!cloverMerchantId || !tokenResponse.access_token) {
      return NextResponse.json(
        { error: "Clover did not return a merchant ID or access token." },
        { status: 400 }
      );
    }

    const merchantProfile = await fetchCloverMerchantProfile(
      cloverMerchantId,
      tokenResponse.access_token
    );

    const tokenExpiresAt = tokenResponse.expires_in
      ? new Date(Date.now() + tokenResponse.expires_in * 1000)
      : null;

    await prisma.merchantConnection.upsert({
      where: {
        cloverMerchantId,
      },
      create: {
        cloverMerchantId,
        merchantName: merchantProfile.name ?? null,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token ?? null,
        tokenExpiresAt,
        syncStatus: "connected",
      },
      update: {
        merchantName: merchantProfile.name ?? null,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token ?? null,
        tokenExpiresAt,
        syncStatus: "connected",
      },
    });

    return NextResponse.json({
      ok: true,
      merchantId: cloverMerchantId,
      merchantName: merchantProfile.name ?? null,
      nextStep: "POST /api/clover/sync/menu to pull categories and items into Postgres.",
    });
  } catch (error) {
    console.error("clover-callback-failed", error);
    return NextResponse.json(
      {
        error: "Clover OAuth callback failed.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
