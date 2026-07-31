"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import playlistJson from "@/data/display/playlist.json";
import { MenuBoardOne } from "@/components/menu-board/MenuBoardOne";
import { MenuBoardFour } from "@/components/menu-board/MenuBoardFour";
import { MenuBoardFive } from "@/components/menu-board/MenuBoardFive";
import { MenuBoardSpecials } from "@/components/menu-board/MenuBoardSpecials";
import { MenuBoardThree } from "@/components/menu-board/MenuBoardThree";
import { MenuBoardTwo } from "@/components/menu-board/MenuBoardTwo";
import type { CSSProperties } from "react";

type PlaylistMenuBoardItem = {
  id: string;
  title: string;
  type:
    | "menu-board-one"
    | "menu-board-two"
    | "menu-board-three"
    | "menu-board-four"
    | "menu-board-five"
    | "menu-board-specials";
  durationSeconds: number;
};

type PlaylistSpotlightItem = {
  id: string;
  title: string;
  type: "spotlight";
  durationSeconds: number;
  kicker: string;
  headline: string;
  subheadline: string;
  image: string;
  items: { name: string; price: string }[];
};

export type PlaylistItem = PlaylistMenuBoardItem | PlaylistSpotlightItem;

export type DisplayPlaylist = {
  updatedLabel: string;
  items: PlaylistItem[];
};

const defaultPlaylist = playlistJson as DisplayPlaylist;
const DISPLAY_VIP_URL = "orderplentyoffishseafood.com/vip";
const DISPLAY_PHONE = "661.471.9620";

type DisplayPlayerProps = {
  playlist?: DisplayPlaylist;
  rotateByUrl?: boolean;
  routePath?: string;
};

function getSafeDurationMs(item: PlaylistItem) {
  return Math.max(10, item.durationSeconds) * 1000;
}

function SpotlightSlide({ item }: { item: PlaylistSpotlightItem }) {
  return (
    <main className={`display-spotlight display-spotlight--${item.id}`}>
      <div className="display-ocean-texture" />
      <section className="display-spotlight-card">
        <div className="display-spotlight-copy">
          <div className="display-brand-row">
            <p className="display-kicker">{item.kicker}</p>
          </div>
          <h1>{item.headline}</h1>
          <p className="display-subheadline">{item.subheadline}</p>

          <div className="display-menu-list">
            {item.items.map((menuItem, index) => (
              <div
                className="display-menu-row"
                key={`${item.id}-${menuItem.name}`}
                style={{ "--row-delay": `${index * 45}ms` } as CSSProperties}
              >
                <span>{menuItem.name}</span>
                <b>{menuItem.price}</b>
              </div>
            ))}
          </div>
        </div>

        <div className="display-image-wrap">
          <Image
            src={item.image}
            alt={item.headline}
            fill
            sizes="50vw"
            className="display-image"
            priority
          />
          <div className="display-mascot-badge" aria-hidden="true">
            <Image
              src="/menu-board/mascot-float-trimmed.png"
              alt=""
              fill
              sizes="16vw"
              className="display-mascot"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function DisplaySlide({ item }: { item: PlaylistItem }) {
  if (item.type === "menu-board-one") {
    return <MenuBoardOne />;
  }

  if (item.type === "menu-board-two") {
    return <MenuBoardTwo />;
  }

  if (item.type === "menu-board-three") {
    return <MenuBoardThree />;
  }

  if (item.type === "menu-board-four") {
    return <MenuBoardFour />;
  }

  if (item.type === "menu-board-five") {
    return <MenuBoardFive />;
  }

  if (item.type === "menu-board-specials") {
    return <MenuBoardSpecials />;
  }

  if (item.type === "spotlight") {
    return <SpotlightSlide item={item} />;
  }

  return null;
}

function getInitialSlideIndex(itemsLength: number) {
  if (typeof window === "undefined" || itemsLength <= 0) {
    return 0;
  }

  const slideParam = new URLSearchParams(window.location.search).get("slide");
  const slideIndex = Number.parseInt(slideParam ?? "0", 10);

  if (Number.isNaN(slideIndex)) {
    return 0;
  }

  return ((slideIndex % itemsLength) + itemsLength) % itemsLength;
}

export function DisplayPlayer({
  playlist = defaultPlaylist,
  rotateByUrl = false,
  routePath,
}: DisplayPlayerProps) {
  const items = playlist.items;
  const [activeIndex, setActiveIndex] = useState(() => getInitialSlideIndex(items.length));
  const activeItem = items[activeIndex] ?? items[0];
  const progressDuration = useMemo(
    () => `${getSafeDurationMs(activeItem)}ms`,
    [activeItem]
  );

  useEffect(() => {
    if (items.length <= 1) {
      return;
    }

    const durationMs = getSafeDurationMs(activeItem);
    const timer = window.setTimeout(() => {
      const nextIndex = (activeIndex + 1) % items.length;

      setActiveIndex(nextIndex);

      if (rotateByUrl && routePath) {
        const nextUrl = `${routePath}?slide=${nextIndex}&ts=${Date.now()}`;
        window.location.replace(nextUrl);
      }
    }, durationMs);

    return () => window.clearTimeout(timer);
  }, [activeIndex, activeItem, items.length, rotateByUrl, routePath]);

  useEffect(() => {
    const reloadTimer = window.setTimeout(() => {
      window.location.reload();
    }, 30 * 60 * 1000);

    const handleOnline = () => window.location.reload();

    window.addEventListener("online", handleOnline);

    return () => {
      window.clearTimeout(reloadTimer);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!activeItem) {
    return (
      <main className="display-spotlight">
        <section className="display-spotlight-card">
          <div className="display-spotlight-copy">
            <p className="display-kicker">Playlist Empty</p>
            <h1>Display Unavailable</h1>
            <p className="display-subheadline">
              Add playlist items to <code>data/display/playlist.json</code>.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="display-player">
      <DisplaySlide item={activeItem} key={activeItem.id} />

      <div className="display-status">
        <span>Order direct. Skip app fees.</span>
        <span>Join VIP: {DISPLAY_VIP_URL}</span>
        <span>Call {DISPLAY_PHONE}</span>
      </div>

      <div className="display-progress" aria-hidden="true">
        <div
          className="display-progress-bar"
          key={activeItem.id}
          style={{ "--progress-duration": progressDuration } as CSSProperties}
        />
      </div>
    </div>
  );
}
