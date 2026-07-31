/* eslint-disable @next/next/no-img-element -- TV menu board art is intentionally rendered at native size. */
"use client";

import { useEffect, useMemo, useRef } from "react";
import { Clock3, MapPin, Phone, Smartphone } from "lucide-react";
import menuBoardOneData from "@/data/menu-board-one.json";
import type { MenuBoardItem, MenuBoardOneColumn, MenuBoardOneData } from "@/lib/menu-board/types";

const data = menuBoardOneData as MenuBoardOneData;
const comboSlide = data.slides.find((slide) => slide.title === "Combos, Family Meals & Sides") ?? data.slides[0];
const lunchDinnerSlide = data.slides.find((slide) => slide.title === "Lunch, Dinner & Fish by the Pound") ?? data.slides[0];
const VIP_URL = "orderplentyoffishseafood.com/vip";
const STORE_PHONE = "661.471.9620";
const STORE_HOURS = "Mon-Thu 11-7:30 • Fri-Sat 11-8:30 • Sun Closed";
const STORE_ADDRESS = "43937 15th Street West, Lancaster, CA";
const BOARD_VIDEO_SRC = "/menu-board/PlentyOfFishVideo.mp4";
const BOARD_VIDEO_POSTER_SRC = "/menu-board/PlentyOfFishVideo-poster.jpg";

function findColumn(slideColumns: MenuBoardOneColumn[], heading: string) {
  return slideColumns.find((column) => column.heading === heading);
}

const lunch = findColumn(lunchDinnerSlide.columns, "Lunch");
const dinner = findColumn(lunchDinnerSlide.columns, "Dinner");
const pound = findColumn(lunchDinnerSlide.columns, "Fish / Lb.");
const familyMeals = findColumn(comboSlide.columns, "Family Meals");
const comboMeals = findColumn(comboSlide.columns, "Combo Meals");
const sides = findColumn(comboSlide.columns, "Sides");

const featuredStack = [
  {
    kicker: "Best Seller",
    name: "Fish & Shrimp Combo",
    price: "$25.88",
    copy: "Crispy fish, seasoned shrimp, and strong direct-order value.",
  },
  {
    kicker: "Top Lunch Pick",
    name: "Catfish Filet Lunch",
    price: "$15.98",
    copy: "Fast pickup plate. Add fries, slaw, yams, or a drink.",
  },
];

function BoardFourVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = true;
    video.defaultMuted = true;

    const playVideo = () => {
      void video.play().catch(() => {
        // Fire TV/Silk may delay autoplay. The poster stays visible while retries continue.
      });
    };

    video.load();
    playVideo();
    const retryTimer = window.setInterval(playVideo, 2500);

    return () => window.clearInterval(retryTimer);
  }, []);

  return (
    <video
      ref={videoRef}
      className="board-four-video"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={BOARD_VIDEO_POSTER_SRC}
      disablePictureInPicture
      onCanPlay={() => {
        void videoRef.current?.play().catch(() => {
          // Poster remains visible if autoplay is paused by the TV browser.
        });
      }}
    >
      <source src={BOARD_VIDEO_SRC} type="video/mp4" />
    </video>
  );
}

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
  showCallout = true,
}: {
  column?: MenuBoardOneColumn;
  className?: string;
  limit?: number;
  showCallout?: boolean;
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
      {showCallout && column.callout ? <p className="board-four-callout">{column.callout}</p> : null}
    </article>
  );
}

export function MenuBoardFour() {
  const tickerItems = useMemo(
    () =>
      [
        "Order direct. Skip app fees.",
        "Free side with any combo",
        "Join VIP for Monday drops",
        "Call ahead 661.471.9620",
        ...data.promos.slice(0, 14),
      ].flatMap((item) => [item]),
    []
  );

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
            <h1>Build Your Basket.</h1>
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

          <div className="board-four-cta-cluster">
            <div className="board-four-red-offer">Free side with any combo</div>
            <div className="board-four-vip">
              <Smartphone />
              <span>VIP</span>
              <b>{VIP_URL}</b>
            </div>
          </div>
        </header>

        <section className="board-four-hero">
          <article className="board-four-feature board-four-feature--lead">
            <p>{featuredStack[0].kicker}</p>
            <h2>{featuredStack[0].name}</h2>
            <strong>{featuredStack[0].price}</strong>
            <span>{featuredStack[0].copy}</span>
          </article>

          <div className="board-four-video-card">
            <BoardFourVideo />
            <div className="board-four-video-caption">
              <b>Fresh. Hot. Ready.</b>
              <span>Text-ready VIP offers at {VIP_URL}</span>
            </div>
          </div>

          <div className="board-four-family">
            <p>Feeds The Crew</p>
            <h2>Family Meals</h2>
            <MenuRows items={familyMeals?.items} limit={3} />
            <span>Bring the whole table. Bigger baskets move fast.</span>
          </div>
        </section>

        <section className="board-four-ticker" aria-label="Rotating menu ticker">
          <div className="board-four-ticker-track">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <span className="board-four-ticker-pill" key={`${item}-${index}`}>
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="board-four-grid" aria-label="Menu highlights">
          <MenuPanel column={comboMeals} limit={4} />
          <MenuPanel column={lunch} limit={4} />
          <MenuPanel column={dinner} limit={4} showCallout={false} />
          <MenuPanel column={pound} limit={4} />
          <MenuPanel column={sides} limit={4} />
        </section>
      </main>
    </div>
  );
}
