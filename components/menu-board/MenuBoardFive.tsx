/* eslint-disable @next/next/no-img-element -- TV menu board art is intentionally rendered at native size. */
"use client";

import { Clock3, MapPin, Phone, Smartphone, Star } from "lucide-react";
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

const bestSellers: MenuBoardItem[] = [
  { name: "Catfish Filet Lunch", price: "$15.98" },
  { name: "Fish & Shrimp Combo", price: "$25.88" },
  { name: "Salmon & Shrimp Combo", price: "$33.75" },
  { name: "Jumbo Shrimp Lunch", price: "$15.75" },
  { name: "Po' Boy Sandwich", price: "$19.25" },
];

function BoardFiveRows({ items = [], limit = 7 }: { items?: MenuBoardItem[]; limit?: number }) {
  return (
    <div className="board-five-rows">
      {items.slice(0, limit).map((item, index) => (
        <div
          className="board-five-row"
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

function SalesPanel({
  title,
  kicker,
  items,
  limit,
}: {
  title: string;
  kicker: string;
  items?: MenuBoardItem[];
  limit?: number;
}) {
  return (
    <article className="board-five-panel">
      <div className="board-five-panel-heading">
        <p>{kicker}</p>
        <h2>{title}</h2>
      </div>
      <BoardFiveRows items={items} limit={limit} />
    </article>
  );
}

export function MenuBoardFive() {
  return (
    <div className="menu-board-five-root">
      <main className="board-five-shell">
        <div className="board-five-texture" aria-hidden="true" />

        <header className="board-five-header">
          <img
            className="board-five-logo"
            src="/menu-board/logo-board-transparent-trimmed.png"
            alt="Plenty of Fish Seafood"
          />

          <div className="board-five-brand">
            <p>Lancaster, California</p>
            <h1>Order More. Save More.</h1>
            <div className="board-five-meta">
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

          <aside className="board-five-top-cta">
            <span>Skip app fees</span>
            <strong>Order Direct</strong>
            <b>{VIP_URL}</b>
          </aside>
        </header>

        <section className="board-five-hero">
          <article className="board-five-offer">
            <p>Top Lunch Pick</p>
            <h2>Catfish Filet Lunch</h2>
            <strong>$15.98</strong>
            <ul>
              <li>Fresh fried, fast pickup</li>
              <li>Great with fries, slaw, or yams</li>
              <li>Add a drink and dessert before you go</li>
            </ul>
          </article>

          <article className="board-five-photo-card">
            <img src="/menu-board/combo-platter.png" alt="Seafood combo plate" />
            <div className="board-five-photo-badge">
              <b>Free side</b>
              <span>with any combo</span>
            </div>
          </article>

          <article className="board-five-vip-card">
            <img src="/menu-board/mascot-float-trimmed.png" alt="" />
            <p>Join VIP</p>
            <h2>Text-ready deals</h2>
            <span>Monday Madness • Taco Tuesday • Gumbo Weekend</span>
            <b>{VIP_URL}</b>
          </article>
        </section>

        <section className="board-five-selling-strip">
          <span>
            <Star />
            Customer Favorites
          </span>
          <span>Order direct and keep more cash in your pocket</span>
          <span>Call ahead: {STORE_PHONE}</span>
        </section>

        <section className="board-five-grid">
          <SalesPanel title="Best Sellers" kicker="Start Here" items={bestSellers} limit={4} />
          <SalesPanel title="Seafood Combos" kicker="Big Flavor" items={combos?.items} limit={4} />
          <SalesPanel title="Lunch Favorites" kicker="Fast Midday Plates" items={lunch?.items} limit={4} />
          <SalesPanel title="Family Meals" kicker="Feeds The Crew" items={familyMeals?.items} limit={3} />
        </section>

        <footer className="board-five-footer">
          <span>
            <Smartphone />
            VIP specials: {VIP_URL}
          </span>
          <strong>Order direct. Skip app fees.</strong>
          <b>Call {STORE_PHONE}</b>
        </footer>
      </main>
    </div>
  );
}
