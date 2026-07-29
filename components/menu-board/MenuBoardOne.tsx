"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import fallbackMenuBoardOne from "@/data/menu-board-one.json";
import type {
  MenuBoardItem,
  MenuBoardOneColumn,
  MenuBoardOneData,
} from "@/lib/menu-board/types";
import { useMenuBoardRefresh } from "./useMenuBoardRefresh";

const SLIDE_DURATION = 10000;
const HERO_DURATION = 5200;

const fallbackData = fallbackMenuBoardOne as MenuBoardOneData;

const heroSlides = [
  {
    kicker: "Best Seller",
    title: "Fish & Shrimp Combo",
    price: "$25.88",
    text: "Crispy fish, seasoned shrimp, and strong direct-order value without delivery app markups.",
    note: "Fresh fried or grilled and made to order.",
  },
  {
    kicker: "Top Lunch Pick",
    title: "Catfish Filet Lunch",
    price: "$15.98",
    text: "A customer favorite with classic seasoning, fast service, and a satisfying lunch portion.",
    note: "Great with fries, slaw, or your favorite side.",
  },
  {
    kicker: "House Favorite",
    title: "Salmon & Shrimp Combo",
    price: "$33.75",
    text: "Big seafood flavor with premium salmon and shrimp for guests who want a fuller plate.",
    note: "A strong dinner choice and one of the most craveable combos.",
  },
  {
    kicker: "Side Spotlight",
    title: "Collard Greens + Red Beans & Rice",
    price: "$4.60",
    text: "Make the sides visible too with hearty, soulful add-ons that round out any seafood plate.",
    note: "Add sides to combos, lunches, and family meals.",
  },
];

const BOARD_VIDEO_SRC = "/menu-board/PlentyOfFishVideo.mp4";
const BOARD_VIDEO_POSTER_SRC = "/menu-board/PlentyOfFishVideo-poster.jpg";
const FAMILY_MEALS_HEADING = "Family Meals";
const VIP_URL = "orderplentyoffishseafood.com/vip";
const STORE_HOURS = "Mon-Thu 11-7:30 • Fri-Sat 11-8:30 • Sun Closed";
const STORE_PHONE = "661.471.9620";

function useRotatingIndex(length: number, duration: number) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % length);
    }, duration);

    return () => window.clearInterval(timer);
  }, [duration, length]);

  return index;
}

function MenuItemRow({ item }: { item: MenuBoardItem }) {
  return (
    <div className="menu-item">
      <span className="item-name">{item.name}</span>
      <span className="price">{item.price}</span>
    </div>
  );
}

function BoardVideo({
  className,
}: {
  className: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = true;
    video.defaultMuted = true;

    const playVideo = () => {
      try {
        const promise = video.play();

        if (promise) {
          void promise.catch(() => {
            // Fire TV/Silk can delay autoplay. Keep the poster visible and retry.
          });
        }
      } catch {
        // Keep the video element mounted so browser-specific autoplay retries can work.
      }
    };

    video.load();
    playVideo();
    const retryTimer = window.setInterval(playVideo, 2500);

    return () => window.clearInterval(retryTimer);
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
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

function FamilyMealsSpotlight({ slides }: { slides: MenuBoardOneData["slides"] }) {
  const familyColumn = slides
    .flatMap((menuSlide) => menuSlide.columns)
    .find((column) => column.heading === FAMILY_MEALS_HEADING);

  if (!familyColumn) {
    return null;
  }

  return (
    <aside className="family-spotlight" aria-label="Family meals">
      <div className="family-spotlight-header">
        <p className="eyebrow">Feeds The Crew</p>
        <h3>Family Meals</h3>
      </div>
      <div className="family-spotlight-list">
        {familyColumn.items.slice(0, 3).map((item) => (
          <MenuItemRow item={item} key={`family-${item.name}`} />
        ))}
      </div>
      {familyColumn.callout ? (
        <p className="family-spotlight-note">{familyColumn.callout}</p>
      ) : null}
    </aside>
  );
}

function MenuColumn({ column }: { column: MenuBoardOneColumn }) {
  const shouldScroll = column.items.length > 7;
  const items = column.items.map((item) => (
    <MenuItemRow item={item} key={`${column.heading}-${item.name}`} />
  ));

  return (
    <article className={`menu-column accent-${column.accent}`}>
      <div className="column-header">
        <h4>{column.heading}</h4>
      </div>

      {shouldScroll ? (
        <div className="column-scroll">
          <div className="column-track is-scrolling">
            <div className="column-list">{items}</div>
            <div className="column-list" aria-hidden="true">
              {items}
            </div>
          </div>
        </div>
      ) : (
        <div className="column-items">{items}</div>
      )}

      {column.callout ? (
        <p className="column-callout">{column.callout}</p>
      ) : null}
    </article>
  );
}

export function MenuBoardOne() {
  const { data } = useMenuBoardRefresh({
    fallbackData,
    publicJsonPath: "/menu-board/menu-board-one.json",
    formatTimestamp: () => "",
  });
  const slideIndex = useRotatingIndex(data.slides.length, SLIDE_DURATION);
  const heroIndex = useRotatingIndex(heroSlides.length, HERO_DURATION);
  const slide = data.slides[slideIndex] ?? data.slides[0];
  const hero = heroSlides[heroIndex];
  const tickerItems = useMemo(() => [...data.promos, ...data.promos], [data.promos]);
  const tickerDuration = Math.max(80, Math.min(data.promos.length * 1.8, 220));

  return (
    <div className="menu-board-one-root">
      <main className="board-shell">
        <div className="board-video board-video-still" aria-hidden="true" />
        <div className="board-overlay" />

        <section className="board-frame">
          <header className="board-header">
            <div className="brand-lockup">
              <img
                className="brand-logo"
                src="/menu-board/newlogo.png"
                alt="Plenty of Fish Seafood logo"
              />
              <div>
                <p className="eyebrow">Lancaster, California</p>
                <h1>Order More. Save More.</h1>
                <p className="headline-note">
                  Join VIP for Monday drops, taco alerts, dessert specials,
                  and direct-order savings.
                </p>
              </div>
            </div>

            <div className="header-stack">
              <div className="promo-ribbon">Free Side With Any Combo</div>
              <div className="store-details">
                <span>43937 15th Street West, Lancaster, CA</span>
                <span>{STORE_PHONE}</span>
                <span>{STORE_HOURS}</span>
              </div>
              <div className="vip-pill">
                <span className="vip-dot" />
                <span>VIP deals: {VIP_URL}</span>
              </div>
            </div>
          </header>

          <section className="hero-strip">
            <div className="hero-content">
              <div className="hero-copy is-rotating" key={hero.title}>
                <p className="kicker">{hero.kicker}</p>
                <h2>{hero.title}</h2>
                <p className="hero-price">{hero.price}</p>
                <p className="hero-text">{hero.text}</p>
                <p className="hero-note">{hero.note}</p>
              </div>

              <FamilyMealsSpotlight slides={data.slides} />
            </div>

            <div className="hero-card">
              <div className="hero-video-shell">
                <BoardVideo
                  className="hero-video"
                />
                <div className="hero-video-caption">
                  <span className="hero-video-tag">VIP Deals</span>
                  <span className="hero-video-copy">
                    Text-ready offers at {VIP_URL}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="promo-ticker" aria-label="Rotating menu ticker">
            <div
              className="ticker-track"
              style={{ "--ticker-duration": `${tickerDuration}s` } as React.CSSProperties}
            >
              {tickerItems.map((promo, index) => (
                <span className="ticker-pill" key={`${promo}-${index}`}>
                  {promo}
                </span>
              ))}
            </div>
          </section>

          <section className="slides-panel">
            <div className="slides-topbar">
              <div>
                <p className="eyebrow">Menu Board</p>
                <h3>{slide.title}</h3>
              </div>
              <div className="slide-controls">
                <span>Order direct. Skip app fees.</span>
                <span>Call {STORE_PHONE}</span>
              </div>
            </div>

            <div className="slide-content">
              <div className="menu-grid is-visible" key={slide.title}>
                {slide.columns.map((column) => (
                  <MenuColumn column={column} key={column.heading} />
                ))}
              </div>
              <p className="data-note">Join VIP for Monday Madness, Taco Tuesday, dessert drops, and launch-only direct order deals.</p>
            </div>
            <div className="slide-progress" aria-hidden="true">
              <div className="slide-progress-bar is-animating" key={slideIndex} />
            </div>
          </section>

          <footer className="board-footer">
            <div className="footer-note">
              <strong>Hours:</strong>
              <span>Mon-Thu 11:00 AM-7:30 PM</span>
              <span>Fri-Sat 11:00 AM-8:30 PM</span>
              <span>Sun Closed</span>
            </div>
            <div className="footer-note footer-note-cta">
              <strong>VIP:</strong>
              <span>{VIP_URL}</span>
              <span>Call {STORE_PHONE}</span>
            </div>
            <div className="footer-note">
              <strong>Sides:</strong>
              <span>coleslaw</span>
              <span>potato salad</span>
              <span>macaroni salad</span>
              <span>red beans &amp; rice</span>
              <span>collard greens</span>
              <span>fries</span>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
