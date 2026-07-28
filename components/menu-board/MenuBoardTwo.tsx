/* eslint-disable @next/next/no-img-element -- TV menu board art is intentionally rendered at native size. */
"use client";

import {
  CheckCircle2,
  Clock3,
  Fish,
  Globe2,
  Heart,
  MapPin,
  Phone,
  Smartphone,
} from "lucide-react";
import { useEffect, useState } from "react";
import bundledMenuBoard from "@/data/menu-board-two.json";
import { formatBoardSyncTime } from "@/lib/menu-board/format";
import type {
  MenuBoardItem,
  MenuBoardTwoData,
  MenuBoardTwoSection,
} from "@/lib/menu-board/types";
import { useMenuBoardRefresh } from "./useMenuBoardRefresh";

const initialBoardData = {
  ...bundledMenuBoard,
  lastSync: "LOCAL MENU",
} as MenuBoardTwoData;

const sideExtras = [
  ["Hush Puppies", "$3.49"],
  ["Garlic Bread", "$2.49"],
  ["Side of Pickles", "$1.49"],
  ["Candy Yams", "$3.49"],
  ["Fried Okra", "$3.49"],
  ["Frog Legs (2pcs)", "$6.99"],
];

const extraSauces = ["Tartar Sauce", "Hot Sauce", "Cocktail Sauce", "Ranch"];
const extraSides = [
  "Coleslaw",
  "Potato Salad",
  "Macaroni Salad",
  "Red Beans & Rice",
  "Collard Greens",
  "Mac N Cheese",
  "French Fries",
  "Green Salad",
  "Hush Puppies",
  "Okra",
  "Candy Yams",
];

function findSection(data: MenuBoardTwoData, title: string) {
  return data.sections.find((section) => section.title === title);
}

export function MenuBoardTwo() {
  const { data, error } = useMenuBoardRefresh({
    fallbackData: initialBoardData,
    publicJsonPath: "/menu-board/menu-board-two.json",
    formatTimestamp: formatBoardSyncTime,
  });
  const [featureIndex, setFeatureIndex] = useState(0);

  useEffect(() => {
    const rotateFeature = window.setInterval(() => {
      setFeatureIndex((index) => index + 1);
    }, 5200);

    return () => window.clearInterval(rotateFeature);
  }, []);

  const featureItems = data.ticker?.length
    ? data.ticker
    : ["Fish & Shrimp $27.95", "Taco Tuesday $4.49", "Peach Cobbler $5.18"];
  const activeFeature = featureItems[featureIndex % featureItems.length];

  return (
    <div className="menu-board-two-root">
      <main className="board-shell">
        <section className="board">
          <OceanTexture />
          <SwimLine />
          <Header data={data} error={error} activeFeature={activeFeature} />
          <section className="top-grid">
            <MenuPanel
              section={findSection(data, "Seafood Combos")}
              className="combos-panel"
              image="/menu-board/combo-platter.png"
              imageAlt="Fish and shrimp combo"
            >
              <div className="meal-callout">
                <b>MAKE IT A MEAL!</b>
                <span>Add extra side + drink</span>
                <span>starting at $3.49</span>
              </div>
            </MenuPanel>
            <MenuPanel
              section={findSection(data, "Family Meals")}
              className="family-panel"
              image="/menu-board/family-platter.jpg"
              imageAlt="Family seafood meal"
            />
            <div className="taco-specials-panel category-panel">
              <MenuList
                section={findSection(data, "Taco Tuesday")}
                className="taco-list"
              />
              <img
                className="taco-art"
                src="/menu-board/salmon-salad.png"
                alt="Fresh seafood plate"
              />
              <MenuList
                section={findSection(data, "Specials")}
                className="specials-list"
              />
            </div>
          </section>
          <section className="bottom-grid">
            <SidesPanel section={findSection(data, "Sides")} />
            <SplitPanel section={findSection(data, "Drinks & Desserts")} />
            <ExtrasPanel />
          </section>
          <Footer />
        </section>
      </main>
    </div>
  );
}

function OceanTexture() {
  return (
    <div className="ocean-texture" aria-hidden="true">
      {Array.from({ length: 12 }, (_, index) => (
        <span
          className="bubble"
          key={index}
          style={
            {
              "--x": `${(index * 29) % 100}%`,
              "--size": `${6 + (index % 5) * 4}px`,
              "--delay": `${(index % 6) * -2.7}s`,
              "--duration": `${15 + (index % 4) * 4}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function SwimLine() {
  return (
    <div className="swim-line" aria-hidden="true">
      <Fish />
      <Fish />
      <Fish />
    </div>
  );
}

function Header({
  data,
  error,
  activeFeature,
}: {
  data: MenuBoardTwoData;
  error: boolean;
  activeFeature: string;
}) {
  return (
    <header className="board-header">
      <img
        className="brand-logo"
        src="/menu-board/logo-board-transparent-trimmed.png"
        alt="Plenty of Fish Seafood"
      />
      <div className="brand-copy">
        <p className="eyebrow">{data.business.city}</p>
        <h1>PLENTY OF FISH MENU BOARD</h1>
        <p className="brand-subtitle">FRESH SEAFOOD. FAST PICKUP. ORDER DIRECT.</p>
        <div className="business-line">
          <span>
            <MapPin />
            {data.business.address}
          </span>
          <span>
            <Phone />
            {data.business.phone}
          </span>
          <span>
            <Globe2 />
            {data.business.cta}
          </span>
        </div>
      </div>
      <div className="header-right">
        {data.promo.active ? (
          <div className="promo-banner">
            <strong>FREE SIDE</strong>
            <span>WITH ANY COMBO!</span>
            <img src="/menu-board/shrimp-platter.png" alt="" />
          </div>
        ) : null}
        <div className="feature-chip" key={activeFeature}>
          <span>NOW FEATURING</span>
          <b>{activeFeature}</b>
        </div>
        <div className={error ? "sync-pill sync-error" : "sync-pill"}>
          <i /> {error ? "RECONNECTING" : `SYNCED ${data.lastSync}`}
        </div>
      </div>
    </header>
  );
}

function PanelHeading({ section }: { section?: MenuBoardTwoSection }) {
  if (!section) {
    return null;
  }

  return (
    <div className="panel-heading">
      <h2>
        <span>★</span>
        {section.title}
        <span>★</span>
      </h2>
      {section.subtitle ? <p>{section.subtitle}</p> : null}
    </div>
  );
}

function MenuRows({ items = [] }: { items?: MenuBoardItem[] }) {
  return (
    <div className="menu-rows">
      {items.map((item, index) => (
        <div
          className="menu-row"
          key={item.name}
          style={{ "--row-delay": `${index * 90}ms` } as React.CSSProperties}
        >
          <span>{item.name}</span>
          <b>{item.price}</b>
        </div>
      ))}
    </div>
  );
}

function MenuPanel({
  section,
  className = "",
  image,
  imageAlt = "",
  children,
}: {
  section?: MenuBoardTwoSection;
  className?: string;
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
}) {
  if (!section) {
    return null;
  }

  return (
    <article className={`category-panel ${className}`}>
      <PanelHeading section={section} />
      <MenuRows items={section.items} />
      {image ? <img className="panel-art" src={image} alt={imageAlt} /> : null}
      {children}
    </article>
  );
}

function MenuList({
  section,
  className = "",
}: {
  section?: MenuBoardTwoSection;
  className?: string;
}) {
  if (!section) {
    return null;
  }

  return (
    <div className={className}>
      <PanelHeading section={section} />
      <MenuRows items={section.items} />
    </div>
  );
}

function SidesPanel({ section }: { section?: MenuBoardTwoSection }) {
  if (!section) {
    return null;
  }

  const combined = [
    ...(section.items ?? []),
    ...sideExtras.map(([name, price]) => ({ name, price })),
  ];

  return (
    <article className="category-panel sides-panel">
      <PanelHeading section={{ ...section, subtitle: "Perfect with any meal." }} />
      <div className="sides-columns">
        <MenuRows items={combined.slice(0, 7)} />
        <MenuRows items={combined.slice(7)} />
      </div>
    </article>
  );
}

function SplitPanel({ section }: { section?: MenuBoardTwoSection }) {
  if (!section) {
    return null;
  }

  return (
    <article className="category-panel split-panel">
      <PanelHeading section={section} />
      <div className="split-columns">
        {(section.columns ?? []).map((column) => (
          <div key={column.title}>
            <h3>{column.title}</h3>
            <MenuRows items={column.items} />
          </div>
        ))}
      </div>
    </article>
  );
}

function ExtrasPanel() {
  return (
    <article className="category-panel extras-panel">
      <div>
        <div className="panel-heading">
          <h2>
            <span>★</span>
            ADD-ONS & EXTRAS
            <span>★</span>
          </h2>
        </div>
        <ExtraBox title="EXTRA SAUCES" price="$0.75" items={extraSauces} />
        <ExtraBox title="EXTRA SIDES" price="$3.49" items={extraSides} />
      </div>
      <div className="thank-you">
        <img
          className="mascot-float"
          src="/menu-board/mascot-float-trimmed.png"
          alt=""
        />
        <p>
          <span>THANK YOU FOR CHOOSING</span>
          <strong>Plenty of Fish!</strong>
          <b>WE APPRECIATE YOU!</b>
        </p>
      </div>
    </article>
  );
}

function ExtraBox({
  title,
  price,
  items,
}: {
  title: string;
  price: string;
  items: string[];
}) {
  return (
    <div className="extra-box">
      <h3>
        <span>{title}</span>
        <b>{price}</b>
      </h3>
      <div>
        {items.map((item) => (
          <small key={item}>• {item}</small>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="board-footer">
      <span>
        <Clock3 />
        <b>FAST PICKUP</b>
        <small>Skip the apps & the wait</small>
      </span>
      <span>
        <Smartphone />
        <b>ORDER DIRECT</b>
        <small>Save on fees</small>
      </span>
      <span>
        <CheckCircle2 />
        <b>FRESH SEAFOOD</b>
        <small>Cooked to order</small>
      </span>
      <span>
        <Heart />
        <b>SUPPORT LOCAL</b>
        <small>Thank you Lancaster!</small>
      </span>
      <strong>FOLLOW US FOR SPECIALS!</strong>
    </footer>
  );
}
