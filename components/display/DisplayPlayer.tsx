"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import playlistJson from "@/data/display/playlist.json";
import { MenuBoardOne } from "@/components/menu-board/MenuBoardOne";
import { MenuBoardTwo } from "@/components/menu-board/MenuBoardTwo";
import type { CSSProperties } from "react";

type PlaylistMenuBoardItem = {
  id: string;
  title: string;
  type: "menu-board-one" | "menu-board-two";
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

type PlaylistItem = PlaylistMenuBoardItem | PlaylistSpotlightItem;

const playlist = playlistJson as {
  updatedLabel: string;
  items: PlaylistItem[];
};

function getSafeDurationMs(item: PlaylistItem) {
  return Math.max(10, item.durationSeconds) * 1000;
}

function SpotlightSlide({ item }: { item: PlaylistSpotlightItem }) {
  return (
    <main className="display-spotlight">
      <div className="display-ocean-texture" />
      <section className="display-spotlight-card">
        <div className="display-spotlight-copy">
          <p className="display-kicker">{item.kicker}</p>
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

  if (item.type === "spotlight") {
    return <SpotlightSlide item={item} />;
  }

  return null;
}

export function DisplayPlayer() {
  const items = playlist.items;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex] ?? items[0];
  const progressDuration = useMemo(
    () => `${getSafeDurationMs(activeItem)}ms`,
    [activeItem]
  );

  useEffect(() => {
    if (items.length <= 1) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % items.length);
    }, getSafeDurationMs(activeItem));

    return () => window.clearTimeout(timer);
  }, [activeItem, items.length]);

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
        <span>{activeItem.title}</span>
        <span>{playlist.updatedLabel}</span>
        <span>
          {activeIndex + 1} / {items.length}
        </span>
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
