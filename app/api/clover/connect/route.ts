import { NextResponse } from "next/server";
import { buildCloverInstallUrl } from "@/lib/clover";

export async function GET() {
  try {
    return NextResponse.redirect(buildCloverInstallUrl());
  } catch (error) {
    console.error("clover-connect-config-error", error);
    return NextResponse.json(
      { error: "Clover environment variables are not configured yet." },
      { status: 500 }
    );
  }
}
