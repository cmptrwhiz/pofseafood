import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Plus, Sparkles } from "lucide-react";
import SiteShell from "@/app/components/SiteShell";
import { BRAND } from "@/lib/site-data";

const SIDE_ORDERS = [
  {
    name: "Hush Puppies",
    price: "$3.08+",
    desc: "Golden, crispy, and built for dipping alongside fried fish or shrimp.",
    img: "/Images/Plenty Of Fish-235.jpg",
  },
  {
    name: "Garlic Bread",
    price: "$3.59+",
    desc: "A buttery add-on that rounds out baskets, combos, and family meals.",
    img: "/Images/sandwich.png",
  },
  {
    name: "Candy Yams",
    price: "$0.00+",
    desc: "Sweet, comforting, and perfect when you want a soulful side plate.",
    img: "/Images/meal.jpg",
  },
  {
    name: "Fried Okra",
    price: "$3.09+",
    desc: "Crispy bite-sized okra with the same hot, fresh seafood-shop energy.",
    img: "/Images/Plenty Of Fish-238.jpg",
  },
] as const;

export const metadata: Metadata = {
  title: "Additional Side Orders | Plenty of Fish Seafood",
  description:
    "Add hush puppies, garlic bread, candy yams, fried okra, and more to your Plenty of Fish Seafood pickup order.",
};

export default function SidesPage() {
  return (
    <SiteShell
      currentPath="/menu"
      title="Additional Side Orders"
      subtitle="Round out your seafood basket with hot sides, sweet comfort picks, and easy add-ons for pickup."
    >
      <section className="overflow-hidden rounded-[2.25rem] border border-blue-300/25 bg-[#06284a]/80 shadow-2xl shadow-black/35 backdrop-blur-sm">
        <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative min-h-[24rem] overflow-hidden bg-[#031b35]">
            <Image
              src="/Images/combo.png"
              alt="Plenty of Fish Seafood combo plate"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#02172d]/25 via-[#06345d]/55 to-[#02172d]/90" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/12 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-200">
                <Sparkles className="h-4 w-4" />
                Add More Flavor
              </div>
              <h2 className="mt-5 font-display text-5xl uppercase leading-none text-white sm:text-6xl">
                Sides Make The Catch
              </h2>
            </div>
          </div>

          <div className="bg-[radial-gradient(circle_at_top_right,rgba(35,116,184,0.42),transparent_34%),linear-gradient(145deg,#06345d,#031b35_78%)] p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              {SIDE_ORDERS.map((side) => (
                <article
                  key={side.name}
                  className="group overflow-hidden rounded-[1.75rem] border border-blue-200/20 bg-white/8 shadow-xl shadow-black/20 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#0b507d]">
                    <Image
                      src={side.img}
                      alt={side.name}
                      fill
                      sizes="(min-width: 640px) 50vw, (min-width: 1024px) 25vw, 100vw"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-2xl font-black text-white">{side.name}</h3>
                      <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-lg font-black text-emerald-300">
                        {side.price}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-blue-100/72">
                      {side.desc}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/8 p-8 backdrop-blur-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-400/12 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-blue-200">
              <Plus className="h-4 w-4" />
              Add To Any Order
            </div>
            <h2 className="mt-5 text-4xl font-black text-white">
              Small sides. Bigger basket energy.
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-blue-100/70">
              Prices may vary by order size and availability. Call ahead or order
              direct for the latest side options with your seafood pickup.
            </p>
          </div>

          <a
            href={BRAND.orderLink}
            className="inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-red-600 px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-700"
          >
            Order Sides
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </SiteShell>
  );
}
