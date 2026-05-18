import type { Metadata } from "next";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import SiteShell from "@/app/components/SiteShell";
import { BRAND, HOURS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Location | Plenty of Fish Seafood",
  description:
    "Find Plenty of Fish Seafood in Lancaster, California, with hours, phone number, directions, and pickup details.",
};

export default function LocationPage() {
  return (
    <SiteShell
      currentPath="/location"
      title="Find Us Fast"
      subtitle="Everything customers need to visit, call ahead, or pick up quickly from our Lancaster location."
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/8 p-8 backdrop-blur-sm">
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-2xl bg-blue-500/15 p-4 text-blue-300">
              <MapPin className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Our Location</h2>
              <p className="mt-2 text-lg text-blue-100/70">{BRAND.address}</p>
            </div>
          </div>

          <div className="mb-8 overflow-hidden rounded-[2rem] border border-white/10">
            <iframe
              title="Plenty of Fish Seafood Map"
              src="https://www.google.com/maps?q=43937%2015th%20Street%20West%2C%20Lancaster%2C%20CA%2093534&z=15&output=embed"
              className="h-[320px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href={BRAND.mapLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-2xl bg-red-600 px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-700"
            >
              <Navigation className="h-4 w-4" />
              Get Directions
            </a>
            <a
              href={BRAND.phoneHref}
              className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-white/15"
            >
              <Phone className="h-4 w-4" />
              Call Ahead
            </a>
          </div>
        </section>

        <section className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/8 p-8 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-2xl bg-emerald-500/15 p-4 text-emerald-300">
                <Clock className="h-7 w-7" />
              </div>
              <h2 className="text-3xl font-black text-white">Hours</h2>
            </div>
            <div className="space-y-4">
              {HOURS.map((entry) => (
                <div
                  key={entry.label}
                  className="flex items-center justify-between border-b border-white/10 pb-3 text-base"
                >
                  <span className="font-bold text-white">{entry.label}</span>
                  <span className="text-blue-100/70">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/8 p-8 backdrop-blur-sm">
            <h2 className="mb-4 text-3xl font-black text-white">Pickup Notes</h2>
            <ul className="space-y-3 text-blue-100/70">
              <li>Call-ahead pickup works best during lunch and dinner rushes.</li>
              <li>Direct website orders help customers skip expensive third-party fees.</li>
              <li>Monday Madness lunch specials typically run from 11:00 AM to 2:00 PM.</li>
            </ul>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
