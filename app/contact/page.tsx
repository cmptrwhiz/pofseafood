import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import SiteShell from "@/app/components/SiteShell";
import { BRAND } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact | Plenty of Fish Seafood",
  description:
    "Contact Plenty of Fish Seafood for pickup questions, directions, direct orders, and restaurant information.",
};

export default function ContactPage() {
  return (
    <SiteShell
      currentPath="/contact"
      title="Contact Plenty of Fish"
      subtitle="Call, email, or stop by. Keep direct orders simple and make it easy for customers to reach the restaurant."
    >
      <div className="grid gap-8 md:grid-cols-3">
        <div className="rounded-[2rem] border border-white/10 bg-white/8 p-8 backdrop-blur-sm">
          <div className="mb-5 inline-flex rounded-2xl bg-emerald-500/15 p-4 text-emerald-300">
            <Phone className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-white">Call</h2>
          <a
            href={BRAND.phoneHref}
            className="mt-4 block text-2xl font-black text-white hover:text-blue-300"
          >
            {BRAND.displayPhone}
          </a>
          <p className="mt-3 text-blue-100/65">
            Best for pickup timing, menu questions, and same-day order help.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/8 p-8 backdrop-blur-sm">
          <div className="mb-5 inline-flex rounded-2xl bg-blue-500/15 p-4 text-blue-300">
            <Mail className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-white">Email</h2>
          <a
            href={`mailto:${BRAND.email}`}
            className="mt-4 block break-all text-xl font-bold text-white hover:text-blue-300"
          >
            {BRAND.email}
          </a>
          <p className="mt-3 text-blue-100/65">
            Use email for partnership requests, media, catering questions, or detailed follow-up.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/8 p-8 backdrop-blur-sm">
          <div className="mb-5 inline-flex rounded-2xl bg-red-500/15 p-4 text-red-300">
            <MapPin className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-white">Visit</h2>
          <p className="mt-4 text-lg font-bold text-white">{BRAND.address}</p>
          <a
            href={BRAND.mapLink}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-2xl bg-white/10 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-white/15"
          >
            Open in Maps
          </a>
        </div>
      </div>

      <div className="mt-8 rounded-[2rem] border border-white/10 bg-[#0a2148]/80 p-8">
        <h2 className="text-3xl font-black text-white">Direct Order Support</h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-blue-100/70">
          For the fastest customer experience, point guests toward direct ordering,
          phone pickup, and clear location details. This page should stay clean,
          simple, and easy to scan from a phone.
        </p>
      </div>
    </SiteShell>
  );
}
