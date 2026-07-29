/* eslint-disable @next/next/no-img-element -- TV menu board art is intentionally rendered at native size. */
"use client";

import { Clock3, MapPin, Phone, Smartphone, Star } from "lucide-react";
import specialsData from "@/data/menu-board-specials.json";

type SpecialItem = {
  label: string;
  title: string;
  time: string;
  description: string;
};

type HeroSpecial = {
  kicker: string;
  title: string;
  time: string;
  description: string;
};

type SpecialsData = {
  business: {
    city: string;
    address: string;
    phone: string;
    vipUrl: string;
    hours: string;
  };
  headline: string;
  subheadline: string;
  hero: HeroSpecial;
  specials: SpecialItem[];
  cta: string[];
};

const data = specialsData as SpecialsData;

function SpecialCard({ special, featured = false }: { special: SpecialItem; featured?: boolean }) {
  return (
    <article className={featured ? "special-card special-card-featured" : "special-card"}>
      <p>{special.label}</p>
      <h2>{special.title}</h2>
      <strong>{special.time}</strong>
      <span>{special.description}</span>
    </article>
  );
}

export function MenuBoardSpecials() {
  return (
    <div className="menu-board-specials-root">
      <main className="specials-board-shell">
        <div className="specials-ocean-texture" aria-hidden="true" />

        <header className="specials-header">
          <img
            className="specials-logo"
            src="/menu-board/logo-board-transparent-trimmed.png"
            alt="Plenty of Fish Seafood"
          />

          <div className="specials-brand">
            <p className="specials-city">{data.business.city}</p>
            <h1>{data.headline}</h1>
            <p>{data.subheadline}</p>

            <div className="specials-meta">
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
                {data.business.hours}
              </span>
            </div>
          </div>

          <div className="specials-vip">
            <Smartphone />
            <span>Join VIP</span>
            <b>{data.business.vipUrl}</b>
          </div>
        </header>

        <section className="specials-hero">
          <div className="specials-hero-copy">
            <p>{data.hero.kicker}</p>
            <h2>{data.hero.title}</h2>
            <strong>{data.hero.time}</strong>
            <span>{data.hero.description}</span>
          </div>

          <div className="specials-hero-art">
            <img src="/menu-board/shrimp-platter.png" alt="Seafood special" />
            <div>
              <Star />
              <b>Lunch Rush Winner</b>
            </div>
          </div>
        </section>

        <section className="specials-grid">
          {data.specials.map((special, index) => (
            <SpecialCard
              key={`${special.label}-${special.title}`}
              special={special}
              featured={index === 0}
            />
          ))}
        </section>

        <section className="specials-cta-row">
          {data.cta.map((cta) => (
            <span key={cta}>{cta}</span>
          ))}
        </section>

        <footer className="specials-footer">
          <img src="/menu-board/mascot-float-trimmed.png" alt="" />
          <b>Come back weekly. Specials change fast.</b>
          <span>Call {data.business.phone}</span>
          <strong>{data.business.vipUrl}</strong>
        </footer>
      </main>
    </div>
  );
}
