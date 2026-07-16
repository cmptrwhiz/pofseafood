import type { Metadata } from "next";
import Image from "next/image";
import { VipSignupForm } from "@/components/VipSignupForm";

export const metadata: Metadata = {
  title: "Join the POF VIP Club | Plenty of Fish Seafood",
  description:
    "Join Plenty of Fish Seafood's VIP Club for Monday Madness, Taco Tuesday, Gumbo Weekend, birthday offers, and direct-order savings.",
  alternates: {
    canonical: "/vip",
  },
};

const orderUrl = "https://www.plentyoffishlancaster.com/order";

const benefits = [
  "Weekly specials",
  "Limited gumbo alerts",
  "Birthday offers",
  "Direct-order savings",
];

const specials = [
  {
    title: "Monday Madness",
    text: "50% off lunches on Mondays from 11 AM to 2 PM.",
    badge: "Lunch Deal",
  },
  {
    title: "Taco Tuesday",
    text: "Fast taco drops and seafood specials for the midweek crowd.",
    badge: "Weekly",
  },
  {
    title: "Veterans Wednesday",
    text: "Respectful offers and local love for those who served.",
    badge: "Local Love",
  },
  {
    title: "Gumbo Weekend",
    text: "Get the alert before the pot sells out.",
    badge: "Limited",
  },
];

export default function VipPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#061735] text-white">
      <section className="relative isolate px-5 py-6 md:px-10 lg:px-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_20%,rgba(0,159,255,0.28),transparent_34%),radial-gradient(circle_at_80%_12%,rgba(0,217,143,0.14),transparent_30%),linear-gradient(135deg,#071734_0%,#0b2e5b_55%,#0069ad_100%)]" />
        <div className="absolute left-[8%] top-[18%] -z-10 h-10 w-10 rounded-full border border-white/20 bg-white/5" />
        <div className="absolute right-[12%] top-[24%] -z-10 h-16 w-16 rounded-full border border-white/20 bg-white/5" />
        <div className="absolute bottom-[15%] left-[38%] -z-10 h-8 w-8 rounded-full border border-white/20 bg-white/5" />

        <header className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href="/vip" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Plenty of Fish Seafood"
              width={72}
              height={72}
              priority
              className="h-14 w-14 object-contain md:h-[72px] md:w-[72px]"
            />
            <span className="text-lg font-black uppercase tracking-[0.08em] md:text-2xl">
              Plenty of Fish Seafood
            </span>
          </a>
          <a
            href={orderUrl}
            className="hidden rounded-full bg-[#ee1c25] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-red-950/40 transition hover:bg-[#ff2730] sm:inline-flex"
          >
            Order Online
          </a>
        </header>

        <div className="mx-auto grid max-w-7xl items-center gap-10 py-12 md:py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-[#7cf0ba]/40 bg-[#00d98f]/10 px-4 py-2 text-sm font-black uppercase tracking-[0.24em] text-[#7cf0ba]">
              Lancaster VIP Launch
            </p>
            <h1 className="max-w-4xl text-6xl font-black uppercase leading-[0.86] tracking-tight md:text-8xl lg:text-[7.5rem]">
              Join the POF VIP Club
            </h1>
            <p className="mt-6 max-w-3xl text-xl font-semibold leading-8 text-blue-100 md:text-2xl md:leading-10">
              Get Monday Madness, Taco Tuesday, Gumbo Weekend and exclusive
              seafood deals sent directly to your phone.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-3 text-base font-black text-white shadow-lg shadow-black/10"
                >
                  <span className="mr-2 text-[#ffd166]">✓</span>
                  {benefit}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={orderUrl}
                className="rounded-2xl bg-[#ee1c25] px-8 py-5 text-base font-black uppercase tracking-[0.16em] text-white shadow-xl shadow-red-950/40 transition hover:-translate-y-0.5 hover:bg-[#ff2730]"
              >
                Order Online
              </a>
              <a
                href="tel:16614719620"
                className="rounded-2xl bg-[#243c96] px-8 py-5 text-base font-black uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-[#2b48b8]"
              >
                Call 661.471.9620
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-6 -top-6 hidden rotate-6 md:block">
              <Image
                src="/old logo-final.png"
                alt=""
                width={120}
                height={120}
                className="drop-shadow-2xl"
              />
            </div>
            <VipSignupForm />
          </div>
        </div>
      </section>

      <section className="bg-[#04112a] px-5 py-14 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ffd166]">
              VIP Specials
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase md:text-6xl">
              Get the deal before the line does.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {specials.map((special) => (
              <article
                key={special.title}
                className="rounded-[1.75rem] border border-white/12 bg-[#102b55] p-5 shadow-xl shadow-black/20"
              >
                <span className="inline-flex rounded-full bg-[#ffd166] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#061735]">
                  {special.badge}
                </span>
                <h3 className="mt-5 text-2xl font-black uppercase">
                  {special.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-blue-100/75">
                  {special.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/12 bg-white/[0.07] p-6 md:p-8">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#7cf0ba]">
              Visit Us
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase">
              Plenty of Fish Seafood
            </h2>
            <p className="mt-5 text-xl font-bold text-blue-100">
              43937 15th Street West
              <br />
              Lancaster, CA 93534
            </p>
            <p className="mt-3 text-xl font-bold text-blue-100">
              661.471.9620
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div
              id="sms-terms"
              className="rounded-[2rem] border border-white/12 bg-white/[0.07] p-6"
            >
              <h3 className="text-2xl font-black uppercase">SMS Terms</h3>
              <p className="mt-3 text-sm leading-6 text-blue-100/75">
                VIP messages may include specials, coupons, launch alerts, and
                restaurant updates. Message frequency varies. Message and data
                rates may apply. Reply STOP to unsubscribe or HELP for help.
              </p>
            </div>
            <div
              id="privacy"
              className="rounded-[2rem] border border-white/12 bg-white/[0.07] p-6"
            >
              <h3 className="text-2xl font-black uppercase">Privacy</h3>
              <p className="mt-3 text-sm leading-6 text-blue-100/75">
                Your phone and email are used for Plenty of Fish Seafood VIP
                communication and operational follow-up. We do not need to sell
                your information to make great fish.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
