import Link from "next/link";
import type { ReactNode } from "react";
import { BRAND } from "@/lib/site-data";

type SiteShellProps = {
  currentPath: "/" | "/menu" | "/location" | "/about" | "/contact";
  title: string;
  subtitle: string;
  children: ReactNode;
};

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/location", label: "Location" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

function linkClass(isActive: boolean) {
  return isActive
    ? "text-white"
    : "text-blue-100/70 transition-colors hover:text-white";
}

export default function SiteShell({
  currentPath,
  title,
  subtitle,
  children,
}: SiteShellProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,#1d4f8f_0%,#0d2b57_32%,#071a3a_60%,#03112a_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-10 top-32 h-16 w-16 rounded-full border border-white/10 bg-white/5" />
        <div className="absolute right-16 top-20 h-10 w-10 rounded-full border border-white/10 bg-white/5" />
        <div className="absolute left-24 top-[38rem] h-12 w-12 rounded-full border border-white/10 bg-white/5" />
        <div className="absolute right-24 top-[48rem] h-20 w-20 rounded-full border border-white/10 bg-white/5" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#142b59]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-4">
            <img
              src={BRAND.logoSrc}
              alt={BRAND.name}
              className="h-16 w-auto object-contain"
            />
            <span className="font-display text-3xl tracking-tight text-white">
              Plenty of Fish Seafood
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-bold uppercase tracking-[0.2em] lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClass(currentPath === link.href)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <a
            href={BRAND.orderLink}
            className="rounded-full bg-red-600 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-700"
          >
            Order Now
          </a>
        </div>
      </header>

      <main className="relative z-10">
        <section className="px-4 pb-8 pt-16 sm:pt-20">
          <div className="mx-auto max-w-6xl text-center">
            <h1 className="font-display text-5xl uppercase tracking-tight text-white sm:text-7xl">
              {title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-blue-100/70 sm:text-2xl">
              {subtitle}
            </p>
          </div>
        </section>

        <div className="px-4 pb-24">
          <div className="mx-auto max-w-6xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
