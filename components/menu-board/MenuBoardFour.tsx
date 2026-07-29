/* eslint-disable @next/next/no-img-element -- TV menu board art is intentionally rendered at native size. */
"use client";

import { Clock3, MapPin, Phone, Smartphone } from "lucide-react";
import menuBoardOneData from "@/data/menu-board-one.json";
import type { MenuBoardItem, MenuBoardOneColumn, MenuBoardOneData } from "@/lib/menu-board/types";

const data = menuBoardOneData as MenuBoardOneData;
const lunchDinnerSlide = data.slides.find((slide) => slide.title === "Lunch, Dinner & Fish by the Pound") ?? data.slides[0];
const comboSlide = data.slides.find((slide) => slide.title === "Combos, Family Meals & Sides") ?? data.slides[0];
const VIP_URL = "orderplentyoffishseafood.com/vip";
const STORE_PHONE = "661.471.9620";
const STORE_HOURS = "Mon-Thu 11-7:30 • Fri-Sat 11-8:30 • Sun Closed";
const STORE_ADDRESS = "43937 15th Street West, Lancaster, CA";

function findColumn(slideColumns: MenuBoardOneColumn[], heading: string) {
  return slideColumns.find((column) => column.heading === heading);
}

const lunch = findColumn(lunchDinnerSlide.columns, "Lunch");
const dinner = findColumn(lunchDinnerSlide.columns, "Dinner");
const pound = findColumn(lunchDinnerSlide.columns, "Fish / Lb.");
const specials = findColumn(lunchDinnerSlide.columns, "Specials");
const familyMeals = findColumn(comboSlide.columns, "Family Meals");

function MenuRows({ items = [], limit = 8 }: { items?: MenuBoardItem[]; limit?: number }) {
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
  column,
  className = "",
  limit,
}: {
  column?: MenuBoardOneColumn;
  className?: string;
  limit?: number;
}) {
  if (!column) {
    return null;
  }

  return (
    <article className={`board-four-panel board-four-panel--${column.accent} ${className}`}>
      <div className="board-four-panel-heading">
        <p>{column.accent === "red" ? "Hot Dinner Pickups" : "Cooked To Order"}</p>
        <h2>{column.heading}</h2>
      </div>
      <MenuRows items={column.items} limit={limit} />
      {column.callout ? <p className="board-four-callout">{column.callout}</p> : null}
    </article>
  );
}

export function MenuBoardFour() {
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
            <h1>Lunch. Dinner. Fish Market.</h1>
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
            <p>Fast Lunch Favorite</p>
            <h2>Catfish Filet Lunch</h2>
            <strong>$15.98</strong>
            <span>Fresh fried or grilled. Add sides, drinks, and dessert before pickup.</span>
          </div>

          <div className="board-four-photo-card">
            <img src="/menu-board/combo-platter.png" alt="Seafood combo meal" />
            <div>
              <b>Make it a meal</b>
              <span>Add a side + drink</span>
            </div>
          </div>

          <div className="board-four-family">
            <p>Feeds The Crew</p>
            <h2>Family Meals</h2>
            <MenuRows items={familyMeals?.items} limit={3} />
          </div>
        </section>

        <section className="board-four-grid">
          <MenuPanel column={lunch} limit={8} />
          <MenuPanel column={dinner} limit={8} />
          <MenuPanel column={pound} limit={10} />
          <MenuPanel column={specials} className="board-four-specials" limit={4} />
        </section>

        <footer className="board-four-footer">
          <img src="/menu-board/mascot-float-trimmed.png" alt="" />
          <span>Order direct. Skip app fees.</span>
          <b>{VIP_URL}</b>
          <strong>Call {STORE_PHONE}</strong>
        </footer>
      </main>
    </div>
  );
}
