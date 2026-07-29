/* eslint-disable @next/next/no-img-element -- TV menu board art is intentionally rendered at native size. */
"use client";

import { Clock3, MapPin, Phone, Smartphone } from "lucide-react";
import menuBoardOneData from "@/data/menu-board-one.json";
import type { MenuBoardItem, MenuBoardOneColumn, MenuBoardOneData } from "@/lib/menu-board/types";

const data = menuBoardOneData as MenuBoardOneData;
const lunchDinnerSlide =
  data.slides.find((slide) => slide.title === "Lunch, Dinner & Fish by the Pound") ?? data.slides[0];
const comboSlide =
  data.slides.find((slide) => slide.title === "Combos, Family Meals & Sides") ?? data.slides[0];

const VIP_URL = "orderplentyoffishseafood.com/vip";
const STORE_PHONE = "661.471.9620";
const STORE_HOURS = "Mon-Thu 11-7:30 • Fri-Sat 11-8:30 • Sun Closed";
const STORE_ADDRESS = "43937 15th Street West, Lancaster, CA";

function findColumn(slideColumns: MenuBoardOneColumn[], heading: string) {
  return slideColumns.find((column) => column.heading === heading);
}

const lunch = findColumn(lunchDinnerSlide.columns, "Lunch");
const dinner = findColumn(lunchDinnerSlide.columns, "Dinner");
const combos = findColumn(comboSlide.columns, "Combo Meals");
const familyMeals = findColumn(comboSlide.columns, "Family Meals");

const topPicks: MenuBoardItem[] = [
  { name: "Catfish Filet Lunch", price: "$15.98" },
  { name: "Fish & Shrimp Combo", price: "$25.88" },
  { name: "Salmon & Shrimp Combo", price: "$33.75" },
  { name: "Jumbo Shrimp Lunch", price: "$15.75" },
  { name: "Po' Boy Sandwich", price: "$19.25" },
];

function MenuRows({ items = [], limit = 7 }: { items?: MenuBoardItem[]; limit?: number }) {
  return (
    <div className="board-four-rows">
      {items.slice(0, limit).map((item, index) => (
        <div
          className="board-four-row"
          key={`${item.name}-${item.price}`}
          style={{ "--row-delay": `${index * 45}ms` } as React.CSSProperties}
        >
          <span>{item.name}</span>
          <b>{item.price}</b>
        </div>
      ))}
    </div>
  );
}

function MenuPanel({
  title,
  kicker,
  items,
  accent = "gold",
  limit,
}: {
  title: string;
  kicker: string;
  items?: MenuBoardItem[];
  accent?: MenuBoardOneColumn["accent"];
  limit?: number;
}) {
  return (
    <article className={`board-four-panel board-four-panel--${accent}`}>
      <div className="board-four-panel-heading">
        <p>{kicker}</p>
        <h2>{title}</h2>
      </div>
      <MenuRows items={items} limit={limit} />
    </article>
  );
}

export function MenuBoardFive() {
  return (
    <div className="menu-board-four-root">
      <main className="board-four-shell">
        <div className="board-four-texture" aria-hidden="true" />

        <header className="board-four-header">
          <img
            className="board-four-logo"
            src="/menu-board/logo-board-transparent-trimmed.png"
            alt="Plenty of Fish Seafood"
          />

          <div className="board-four-brand">
            <p>Lancaster, California</p>
            <h1>Best Sellers. Fast Pickup.</h1>
            <div className="board-four-meta">
              <span>
                <MapPin />
                {STORE_ADDRESS}
              </span>
              <span>
                <Phone />
                {STORE_PHONE}
              </span>
              <span>
                <Clock3 />
                {STORE_HOURS}
              </span>
            </div>
          </div>

          <div className="board-four-vip">
            <Smartphone />
            <span>VIP Deals</span>
            <b>{VIP_URL}</b>
          </div>
        </header>

        <section className="board-four-hero">
          <div className="board-four-feature">
            <p>Most Craveable</p>
            <h2>Fish. Shrimp. Fries.</h2>
            <strong>Order Direct</strong>
            <span>Skip app markups. Add sides, drinks, and dessert before pickup.</span>
          </div>

          <div className="board-four-photo-card">
            <img src="/menu-board/shrimp-platter.png" alt="Shrimp basket" />
            <div>
              <b>Make it a meal</b>
              <span>Add side + drink</span>
            </div>
          </div>

          <div className="board-four-family">
            <p>Customer Picks</p>
            <h2>Top Orders</h2>
            <MenuRows items={topPicks} limit={5} />
          </div>
        </section>

        <section className="board-four-grid">
          <MenuPanel title="Lunch Favorites" kicker="Fast Midday Plates" items={lunch?.items} limit={8} />
          <MenuPanel title="Dinner Plates" kicker="Hot After Work" items={dinner?.items} accent="red" limit={8} />
          <MenuPanel title="Seafood Combos" kicker="Big Flavor" items={combos?.items} accent="blue" limit={8} />
          <MenuPanel title="Family Meals" kicker="Feeds The Crew" items={familyMeals?.items} limit={3} />
        </section>

        <footer className="board-four-footer">
          <img src="/menu-board/mascot-float-trimmed.png" alt="" />
          <span>Join VIP for specials.</span>
          <b>{VIP_URL}</b>
          <strong>Call {STORE_PHONE}</strong>
        </footer>
      </main>
    </div>
  );
}
