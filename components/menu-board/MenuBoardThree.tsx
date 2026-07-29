/* eslint-disable @next/next/no-img-element -- TV menu board art is intentionally rendered at native size. */
"use client";

import { Clock3, MapPin, Phone, Smartphone } from "lucide-react";
import boardData from "@/data/menu-board-three.json";

type BoardItem = {
  name: string;
  price: string;
};

type BoardSection = {
  title: string;
  kicker: string;
  image: string;
  items: BoardItem[];
};

type BoardThreeData = {
  lastSync: string;
  business: {
    city: string;
    address: string;
    phone: string;
  };
  sections: BoardSection[];
};

const data = boardData as BoardThreeData;
const VIP_URL = "orderplentyoffishseafood.com/vip";
const STORE_HOURS = "Mon-Thu 11-7:30 • Fri-Sat 11-8:30 • Sun Closed";

function MenuRows({ items }: { items: BoardItem[] }) {
  return (
    <div className="board-three-rows">
      {items.map((item, index) => (
        <div
          className="board-three-row"
          key={item.name}
          style={{ "--row-delay": `${index * 55}ms` } as React.CSSProperties}
        >
          <span>{item.name}</span>
          <b>{item.price}</b>
        </div>
      ))}
    </div>
  );
}

function SectionPanel({
  section,
  variant,
}: {
  section: BoardSection;
  variant: "sides" | "drinks";
}) {
  return (
    <article className={`board-three-panel board-three-panel--${variant}`}>
      <div className="board-three-image">
        <img src={section.image} alt={section.title} />
        <div className="board-three-image-tag">{section.kicker}</div>
      </div>

      <div className="board-three-panel-copy">
        <p>{section.kicker}</p>
        <h2>{section.title}</h2>
        <MenuRows items={section.items} />
      </div>
    </article>
  );
}

export function MenuBoardThree() {
  const [sides, drinks] = data.sections;

  return (
    <div className="menu-board-three-root">
      <main className="board-three-shell">
        <div className="board-three-bubbles" aria-hidden="true">
          {Array.from({ length: 16 }, (_, index) => (
            <span
              key={index}
              style={
                {
                  "--x": `${(index * 17) % 100}%`,
                  "--y": `${(index * 23) % 100}%`,
                  "--size": `${10 + (index % 6) * 7}px`,
                  "--delay": `${index * -0.45}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <section className="board-three-stage">
          <div className="board-three-red-sprinkles" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="board-three-floating-mascots" aria-hidden="true">
            <img src="/menu-board/mascot-float-trimmed.png" alt="" />
            <img src="/menu-board/mascot-float-trimmed.png" alt="" />
          </div>

          <header className="board-three-header">
            <img
              className="board-three-logo"
              src="/menu-board/logo-board-transparent-trimmed.png"
              alt="Plenty of Fish Seafood"
            />

            <div>
              <p className="board-three-city">{data.business.city}</p>
              <h1>Additional Sides, Drinks & Desserts</h1>
              <div className="board-three-meta">
                <span>
                  <MapPin />
                  {data.business.address}
                </span>
                <span>
                  <Phone />
                  {data.business.phone}
                </span>
                <span>
                  <Clock3 />
                  {STORE_HOURS}
                </span>
              </div>
            </div>

            <div className="board-three-vip">
              <Smartphone />
              <span>VIP Specials</span>
              <b>{VIP_URL}</b>
            </div>
          </header>

          <section className="board-three-grid">
            <SectionPanel section={sides} variant="sides" />

            <div className="board-three-mascot-card" aria-hidden="true">
              <img src="/menu-board/mascot-float-trimmed.png" alt="" />
              <strong>ADD A SIDE</strong>
              <span>MAKE IT A MEAL</span>
            </div>

            <SectionPanel section={drinks} variant="drinks" />
          </section>

          <footer className="board-three-footer">
            <span>Add a side. Grab a drink. Make it a meal.</span>
            <b>Join VIP: {VIP_URL}</b>
            <span>Call {data.business.phone}</span>
          </footer>
        </section>
      </main>
    </div>
  );
}
