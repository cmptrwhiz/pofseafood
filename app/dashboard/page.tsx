import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Dashboard | Plenty of Fish Seafood",
  description:
    "Internal CRM dashboard for captured leads and direct-order submissions.",
};

function currencyFromCents(value: number) {
  return `$${(value / 100).toFixed(2)}`;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export default async function DashboardPage() {
  const [orders, leads] = await Promise.all([
    prisma.orderCapture.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 25,
      include: {
        customerLead: true,
      },
    }),
    prisma.customerLead.findMany({
      orderBy: {
        lastSeenAt: "desc",
      },
      take: 25,
      include: {
        _count: {
          select: {
            orderCaptures: true,
          },
        },
      },
    }),
  ]);

  const totalRevenueCents = orders.reduce(
    (sum, order) => sum + order.totalCents,
    0
  );
  const smsOptIns = leads.filter((lead) => lead.smsConsent).length;
  const emailOptIns = leads.filter((lead) => lead.emailConsent).length;

  return (
    <div className="min-h-screen bg-[#041732] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300">
              Internal CRM
            </p>
            <h1 className="mt-3 font-display text-4xl uppercase tracking-tight sm:text-6xl">
              Direct Order Dashboard
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-blue-100/70 sm:text-lg">
              Captured leads and order submissions from the website are now
              stored in Supabase. This page is the first internal view for the
              restaurant to monitor direct-order activity.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex rounded-2xl bg-white/10 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-white/15"
          >
            Back to Site
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur-sm">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200/50">
              Recent Orders
            </p>
            <p className="mt-4 text-4xl font-black text-white">{orders.length}</p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur-sm">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200/50">
              Captured Leads
            </p>
            <p className="mt-4 text-4xl font-black text-white">{leads.length}</p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur-sm">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200/50">
              Visible Revenue
            </p>
            <p className="mt-4 text-4xl font-black text-white">
              {currencyFromCents(totalRevenueCents)}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur-sm">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200/50">
              Opt-ins
            </p>
            <p className="mt-4 text-lg font-black text-white">
              {smsOptIns} SMS / {emailOptIns} Email
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">Recent Orders</h2>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-200/50">
                Latest 25
              </span>
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-[#071a3a] p-6 text-sm text-blue-100/60">
                  No order captures yet. Once customers submit direct orders,
                  they will show up here with totals and consent metadata.
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-[1.5rem] border border-white/10 bg-[#071a3a] p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-lg font-black text-white">
                          {order.customerName}
                        </p>
                        <p className="mt-1 text-sm text-blue-100/60">
                          {order.customerPhone}
                          {order.customerEmail ? ` • ${order.customerEmail}` : ""}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xl font-black text-emerald-300">
                          {currencyFromCents(order.totalCents)}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-blue-200/50">
                          {order.fulfillmentType}
                          {order.pickupTime ? ` • ${order.pickupTime}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {Array.isArray(order.itemsJson)
                        ? order.itemsJson.map((item, index) => {
                            const name =
                              typeof item === "object" &&
                              item &&
                              "name" in item &&
                              typeof item.name === "string"
                                ? item.name
                                : `Item ${index + 1}`;
                            const quantity =
                              typeof item === "object" &&
                              item &&
                              "quantity" in item &&
                              typeof item.quantity === "number"
                                ? item.quantity
                                : 1;

                            return (
                              <span
                                key={`${order.id}-${index}`}
                                className="rounded-full bg-white/8 px-3 py-1 text-xs font-bold text-blue-100/80"
                              >
                                {quantity}x {name}
                              </span>
                            );
                          })
                        : null}
                    </div>
                    <p className="mt-4 text-xs text-blue-200/50">
                      Captured {formatDate(order.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">Lead List</h2>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-200/50">
                Latest 25
              </span>
            </div>

            <div className="space-y-4">
              {leads.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-[#071a3a] p-6 text-sm text-blue-100/60">
                  No leads captured yet. Phone and email signups from the
                  checkout flow will populate this list.
                </div>
              ) : (
                leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="rounded-[1.5rem] border border-white/10 bg-[#071a3a] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-black text-white">
                          {lead.fullName}
                        </p>
                        <p className="mt-1 text-sm text-blue-100/60">
                          {lead.phoneRaw}
                          {lead.email ? ` • ${lead.email}` : ""}
                        </p>
                      </div>
                      <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-blue-100/75">
                        {lead._count.orderCaptures} orders
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {lead.smsConsent ? (
                        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                          SMS Opt-in
                        </span>
                      ) : null}
                      {lead.emailConsent ? (
                        <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-300">
                          Email Opt-in
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-4 text-xs text-blue-200/50">
                      Last seen {formatDate(lead.lastSeenAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
