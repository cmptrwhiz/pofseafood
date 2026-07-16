"use client";

import { FormEvent, useState } from "react";

type SignupState =
  | { status: "idle"; message: "" }
  | { status: "loading"; message: "" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const consentText =
  "By checking this box, I agree to receive recurring promotional text messages from Plenty of Fish Seafood, including specials and offers. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe or HELP for help. Consent is not required to make a purchase.";

export function VipSignupForm() {
  const [state, setState] = useState<SignupState>({
    status: "idle",
    message: "",
  });
  const [smsConsent, setSmsConsent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state.status === "loading" || state.status === "success") {
      return;
    }

    const formData = new FormData(event.currentTarget);

    setState({ status: "loading", message: "" });

    try {
      const response = await fetch("/api/sms/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.get("firstName"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          smsConsent,
          website: formData.get("website"),
          company: formData.get("company"),
          url: formData.get("url"),
          turnstileToken: formData.get("cf-turnstile-response"),
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(data?.error || "VIP signup failed.");
      }

      setState({
        status: "success",
        message:
          "You're on the VIP list. Watch your phone for POF specials and launch updates.",
      });
    } catch (error) {
      setState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to join the VIP list right now.",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-white/15 bg-white/[0.08] p-5 shadow-2xl shadow-black/30 backdrop-blur md:p-7"
    >
      <div className="mb-5">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[#7cf0ba]">
          Join Free
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
          Get the first bite.
        </h2>
        <p className="mt-3 text-sm leading-6 text-blue-100/80">
          We will text VIP-only specials, launch alerts, and weekly seafood
          deals. No spammy nonsense, just the good stuff.
        </p>
      </div>

      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
        <label>
          URL
          <input name="url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-bold text-white">
          First name
          <input
            required
            name="firstName"
            maxLength={60}
            placeholder="Darryl"
            className="rounded-2xl border border-white/20 bg-[#061a36] px-4 py-4 text-base text-white outline-none ring-[#7cf0ba]/50 transition placeholder:text-blue-100/40 focus:ring-4"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-white">
          Mobile number
          <input
            required
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(661) 555-1234"
            className="rounded-2xl border border-white/20 bg-[#061a36] px-4 py-4 text-base text-white outline-none ring-[#7cf0ba]/50 transition placeholder:text-blue-100/40 focus:ring-4"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-white">
          Email <span className="font-medium text-blue-100/55">optional</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="rounded-2xl border border-white/20 bg-[#061a36] px-4 py-4 text-base text-white outline-none ring-[#7cf0ba]/50 transition placeholder:text-blue-100/40 focus:ring-4"
          />
        </label>

        <label className="flex gap-3 rounded-2xl border border-white/15 bg-[#061a36]/70 p-4 text-sm leading-6 text-blue-100/85">
          <input
            required
            type="checkbox"
            checked={smsConsent}
            onChange={(event) => setSmsConsent(event.target.checked)}
            className="mt-1 h-5 w-5 accent-[#00d98f]"
          />
          <span>
            {consentText}{" "}
            <a className="font-bold text-white underline" href="#sms-terms">
              SMS terms
            </a>{" "}
            and{" "}
            <a className="font-bold text-white underline" href="#privacy">
              privacy
            </a>
            .
          </span>
        </label>
      </div>

      {state.message ? (
        <div
          className={`mt-4 rounded-2xl px-4 py-3 text-sm font-bold ${
            state.status === "success"
              ? "bg-[#00d98f]/15 text-[#7cf0ba]"
              : "bg-red-500/15 text-red-100"
          }`}
          role="status"
        >
          {state.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={state.status === "loading" || state.status === "success"}
        className="mt-5 w-full rounded-2xl bg-[#ee1c25] px-6 py-5 text-lg font-black uppercase tracking-[0.16em] text-white shadow-xl shadow-red-950/40 transition hover:-translate-y-0.5 hover:bg-[#ff2730] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state.status === "loading"
          ? "Joining..."
          : state.status === "success"
            ? "You're In"
            : "Join VIP Club"}
      </button>
    </form>
  );
}
