import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, CakeSlice, CupSoda, Sparkles } from "lucide-react";
import SiteShell from "@/app/components/SiteShell";
import { BRAND } from "@/lib/site-data";

const DESSERTS = [
  { name: "Peach Cobbler", price: "$5.68" },
  { name: "Pecan Pie", price: "$5.16" },
] as const;

const DRINKS = [
  { name: "Bottled Water", price: "$2.35" },
  { name: "Dr Pepper", price: "$3.09" },
  { name: "Orange Crush", price: "$3.09" },
  { name: "Pepsi", price: "$3.09" },
  { name: "Diet Coke", price: "$3.09" },
  { name: "Coca-Cola", price: "$3.09" },
  { name: "Sprite", price: "$3.09" },
  { name: "Powerade - Orange", price: "$3.09" },
  { name: "Powerade - Blue", price: "$3.09" },
  { name: "Powerade - Red", price: "$3.09" },
  { name: "Arizona", price: "$3.09" },
] as const;

export const metadata: Metadata = {
  title: "Drinks & Desserts | Plenty of Fish Seafood",
  description:
    "Add bottled water, sodas, Powerade, Arizona, peach cobbler, pecan pie, and more to your Plenty of Fish Seafood order.",
};

function MenuList({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: typeof CupSoda;
  items: readonly { name: string; price: string }[];
}) {
  return (
    <section className="rounded-[2rem] border border-blue-200/20 bg-[#06284a]/82 p-6 shadow-xl shadow-black/20">
      <div className="flex items-center gap-3 text-emerald-300">
        <span className="rounded-2xl bg-emerald-400/12 p-3">
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="font-display text-4xl uppercase text-white">{title}</h2>
      </div>

      <div className="mt-6 divide-y divide-blue-200/12">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-5 py-4"
          >
            <span className="text-xl font-black text-white">{item.name}</span>
            <span className="rounded-full bg-emerald-400/15 px-4 py-2 text-xl font-black text-emerald-300">
              {item.price}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function DrinksDessertsPage() {
  return (
    <SiteShell
      currentPath="/menu"
      title="Drinks & Desserts"
      subtitle="Finish the pickup order with cold drinks, classic sodas, and sweet add-ons."
    >
      <section className="overflow-hidden rounded-[2.25rem] border border-blue-300/25 bg-[#06284a]/80 shadow-2xl shadow-black/35 backdrop-blur-sm">
        <div className="grid gap-0 lg:grid-cols-[1fr_0.9fr]">
          <div className="bg-[radial-gradient(circle_at_top_left,rgba(35,116,184,0.46),transparent_32%),linear-gradient(145deg,#06345d,#031b35_78%)] p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-amber-200">
              <Sparkles className="h-4 w-4" />
              Add The Extras
            </div>
            <h2 className="mt-6 font-display text-6xl uppercase leading-none text-white sm:text-7xl">
              Cold Drinks. Sweet Finish.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-blue-100/75">
              Keep checkout simple with the drinks and desserts customers already
              expect next to fried seafood, baskets, combos, and family meals.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <MenuList title="Desserts" icon={CakeSlice} items={DESSERTS} />
              <MenuList title="Drinks" icon={CupSoda} items={DRINKS} />
            </div>
          </div>

          <div className="relative min-h-[28rem] overflow-hidden bg-[#031b35]">
            <Image
              src="/Images/Plenty Of Fish-240.jpg"
              alt="Plenty of Fish Seafood dessert and drink add-ons"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover opacity-84"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#02172d]/10 via-[#06345d]/45 to-[#02172d]/90" />
            <div className="absolute bottom-6 left-6 right-6 rounded-[1.75rem] border border-white/10 bg-[#02172d]/72 p-6 backdrop-blur-sm">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
                Pickup Tip
              </p>
              <h3 className="mt-3 text-3xl font-black text-white">
                Add drinks before you roll.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-blue-100/72">
                Bottled water, sodas, Powerade, and Arizona keep combo orders
                easy for families, crews, and lunch rush pickups.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/8 p-8 backdrop-blur-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-4xl font-black text-white">
              Add desserts and drinks to any seafood order.
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-blue-100/70">
              Availability may vary. Order direct or call ahead for the latest
              dessert case and drink cooler options.
            </p>
          </div>

          <a
            href={BRAND.orderLink}
            className="inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-red-600 px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-700"
          >
            Order Extras
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </SiteShell>
  );
}
