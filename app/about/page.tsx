import type { Metadata } from "next";
import SiteShell from "@/app/components/SiteShell";
import { ABOUT_POINTS, BRAND, REVIEW_QUOTES } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "About | Plenty of Fish Seafood",
  description:
    "Learn more about Plenty of Fish Seafood, the Lancaster brand story, and what makes the restaurant stand out for direct ordering and local search.",
};

export default function AboutPage() {
  return (
    <SiteShell
      currentPath="/about"
      title="About Plenty of Fish"
      subtitle="A brand page that helps customers and search engines understand who the restaurant is, where it serves, and why direct ordering matters."
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/8 p-8 backdrop-blur-sm">
          <h2 className="text-3xl font-black text-white">Brand Story</h2>
          <p className="mt-5 text-lg leading-relaxed text-blue-100/72">
            Plenty of Fish Seafood is positioned as a Lancaster seafood spot built
            around fresh fried seafood, combo meals, baskets, and strong value.
            The site should reinforce that identity clearly for customers, for
            branded search, and for local entity understanding across Google.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-blue-100/72">
            The direct-order push matters because it keeps pricing cleaner,
            protects margin, and gives the restaurant control over customer
            relationships instead of handing them to third-party marketplaces.
          </p>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/8 p-8 backdrop-blur-sm">
          <h2 className="text-3xl font-black text-white">What We Want Google to Understand</h2>
          <ul className="mt-5 space-y-4 text-blue-100/72">
            {ABOUT_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2rem] border border-white/10 bg-[#0a2148]/80 p-8">
          <h2 className="text-3xl font-black text-white">Location Identity</h2>
          <p className="mt-4 text-lg leading-relaxed text-blue-100/72">
            The strongest public identity signals should stay tied to the restaurant
            name, the Lancaster address, the direct-order website, the phone number,
            and the restaurant menu.
          </p>
          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
            <p className="font-bold text-white">{BRAND.name}</p>
            <p className="mt-2 text-blue-100/70">{BRAND.address}</p>
            <p className="mt-1 text-blue-100/70">{BRAND.displayPhone}</p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[#0a2148]/80 p-8">
          <h2 className="text-3xl font-black text-white">Customer Signals</h2>
          <div className="mt-5 space-y-5">
            {REVIEW_QUOTES.map((quote) => (
              <blockquote
                key={quote}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-blue-100/72"
              >
                “{quote}”
              </blockquote>
            ))}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
