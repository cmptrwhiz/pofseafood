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

const vipSignupSchema = z
  .object({
    phone: z.string().trim().max(30).optional().default(""),
    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .optional()
      .or(z.literal("")),
    website: z.string().trim().max(200).optional().default(""),
    company: z.string().trim().max(200).optional().default(""),
    url: z.string().trim().max(200).optional().default(""),
    turnstileToken: z.string().trim().max(4096).optional().default(""),
  })
  .refine((data) => Boolean(data.phone || data.email), {
    message: "Phone or email is required.",
    path: ["phone"],
  });

function normalizePhone(phone?: string | null) {
  return phone?.replace(/\D/g, "") || "";
}

function normalizeEmail(email?: string | null) {
  const normalized = email?.trim().toLowerCase();
  return normalized || null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = vipSignupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid signup details.",
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
      key: `vip:${ip}`,
      limit: 8,
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

    const phoneRaw = parsed.data.phone;
    const emailNormalized = normalizeEmail(parsed.data.email);
    const phoneNormalized = normalizePhone(phoneRaw);

    if (phoneRaw && phoneNormalized.length < 7) {
      return NextResponse.json(
        { error: "Enter a valid phone number." },
        { status: 422 }
      );
    }

    const leadIdentity = phoneNormalized || `email:${emailNormalized}`;
    const lead = await prisma.customerLead.upsert({
      where: {
        phoneNormalized: leadIdentity,
      },
      update: {
        phoneRaw: phoneRaw || "(email only)",
        email: emailNormalized,
        emailNormalized,
        smsConsent: Boolean(phoneNormalized),
        emailConsent: Boolean(emailNormalized),
        source: "vip_list",
        lastSeenAt: new Date(),
      },
      create: {
        fullName: "VIP Subscriber",
        phoneRaw: phoneRaw || "(email only)",
        phoneNormalized: leadIdentity,
        email: emailNormalized,
        emailNormalized,
        smsConsent: Boolean(phoneNormalized),
        emailConsent: Boolean(emailNormalized),
        source: "vip_list",
      },
    });

    console.log(
      "vip-signup",
      JSON.stringify({
        leadId: lead.id,
        phoneRaw,
        email: emailNormalized,
        ip,
      })
    );

    return NextResponse.json({ ok: true, leadId: lead.id });
  } catch (error) {
    console.error("vip-signup-failed", error);
    return NextResponse.json(
      { error: "Unable to capture VIP signup." },
      { status: 400 }
    );
  }
}
