import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Dashboard | Plenty of Fish Seafood",
  description:
    "Internal CRM dashboard for captured leads and direct-order submissions.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

function currencyFromCents(value: number) {
  const cents = Number(value);
  if (!Number.isFinite(cents)) {
    return "$0.00";
  }

  return `$${(cents / 100).toFixed(2)}`;
}

function safeCents(value: unknown) {
  const cents = Number(value);
  return Number.isFinite(cents) ? cents : 0;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function formatDateTime(value?: Date | null) {
  if (!value) {
    return "Not synced yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

function statusClassName(status: string) {
  if (status === "restaurant_notified") {
    return "bg-emerald-500/15 text-emerald-300";
  }

  if (status === "notification_failed") {
    return "bg-amber-500/15 text-amber-200";
  }

  if (status === "completed") {
    return "bg-blue-500/15 text-blue-200";
  }

  if (status === "cancelled") {
    return "bg-red-500/15 text-red-200";
  }

  return "bg-white/8 text-blue-100/75";
}

export default async function DashboardPage() {
  let orders: Prisma.OrderCaptureGetPayload<{
    include: { customerLead: true };
  }>[] = [];
  let leads: Prisma.CustomerLeadGetPayload<{
    include: { _count: { select: { orderCaptures: true } } };
  }>[] = [];
  let merchantConnection: Prisma.MerchantConnectionGetPayload<{
    include: {
      _count: {
        select: {
          menuItems: true;
          menuCategories: true;
        };
      };
    };
  }> | null = null;
  let syncEvents: Prisma.SyncEventGetPayload<{
    include: {
      merchantConnection: {
        select: {
          merchantName: true;
          cloverMerchantId: true;
        };
      };
    };
  }>[] = [];
  let loadError: string | null = null;

  try {
    [orders, leads, merchantConnection, syncEvents] = await Promise.all([
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
      prisma.merchantConnection.findFirst({
        orderBy: [{ lastSyncAt: "desc" }, { createdAt: "desc" }],
        include: {
          _count: {
            select: {
              menuItems: true,
              menuCategories: true,
            },
          },
        },
      }),
      prisma.syncEvent.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        include: {
          merchantConnection: {
            select: {
              merchantName: true,
              cloverMerchantId: true,
            },
          },
        },
      }),
    ]);
  } catch (error) {
    console.error("dashboard-load-failed", error);
    loadError =
      "CRM tables are not available to the running app yet. Regenerate Prisma and redeploy, then reload this dashboard.";
  }

  const totalRevenueCents = orders.reduce(
    (sum, order) => sum + safeCents(order.totalCents),
    0
  );
  const notifiedOrders = orders.filter(
    (order) => order.status === "restaurant_notified"
  ).length;
  const estimatedThirdPartyFeesAvoidedCents = orders.reduce((sum, order) => {
    const itemCount = Array.isArray(order.itemsJson)
      ? order.itemsJson.reduce<number>((count, item) => {
          if (
            typeof item === "object" &&
            item &&
            "quantity" in item &&
            typeof item.quantity === "number"
          ) {
            return count + item.quantity;
          }

          return count + 1;
        }, 0)
      : 1;

    return sum + itemCount * 400;
  }, 0);
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

        <div className="grid gap-4 md:grid-cols-5">
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
              Direct Revenue
            </p>
            <p className="mt-4 text-4xl font-black text-white">
              {currencyFromCents(totalRevenueCents)}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-emerald-300/15 bg-emerald-400/8 p-6 backdrop-blur-sm">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200/60">
              Fees Avoided
            </p>
            <p className="mt-4 text-4xl font-black text-emerald-300">
              {currencyFromCents(estimatedThirdPartyFeesAvoidedCents)}
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

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-emerald-300/15 bg-emerald-400/8 p-6 backdrop-blur-sm">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-200/70">
              Proof Loop
            </p>
            <h2 className="mt-3 text-3xl font-black text-white">
              Clover menu in. Direct orders out.
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] bg-[#071a3a]/80 p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200/50">
                  Last Clover Sync
                </p>
                <p className="mt-3 text-lg font-black text-white">
                  {formatDateTime(merchantConnection?.lastSyncAt)}
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-[#071a3a]/80 p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200/50">
                  Synced Menu
                </p>
                <p className="mt-3 text-lg font-black text-white">
                  {merchantConnection?._count.menuItems ?? 0} items /{" "}
                  {merchantConnection?._count.menuCategories ?? 0} categories
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-[#071a3a]/80 p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200/50">
                  Notified Orders
                </p>
                <p className="mt-3 text-lg font-black text-white">
                  {notifiedOrders} of {orders.length}
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-emerald-100/75">
              Fee savings estimate uses $4 per ordered item as a conservative
              midpoint of common third-party app markup. It is directional proof,
              not accounting.
            </p>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">Sync History</h2>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-200/50">
                Latest 10
              </span>
            </div>
            <div className="space-y-3">
              {syncEvents.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-[#071a3a] p-5 text-sm text-blue-100/60">
                  No sync events recorded yet.
                </div>
              ) : (
                syncEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-[1.25rem] border border-white/10 bg-[#071a3a] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black text-white">{event.eventType}</p>
                        <p className="mt-1 text-xs text-blue-100/55">
                          {event.source} •{" "}
                          {event.merchantConnection.merchantName ||
                            event.merchantConnection.cloverMerchantId}
                        </p>
                      </div>
                      <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100/75">
                        {event.status}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-blue-200/50">
                      {formatDateTime(event.createdAt)}
                    </p>
                    {event.errorMessage ? (
                      <p className="mt-2 text-xs text-amber-200">
                        {event.errorMessage}
                      </p>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {loadError ? (
          <div className="mt-8 rounded-[1.75rem] border border-amber-300/20 bg-amber-300/10 p-6 text-amber-100">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-200">
              Setup Needed
            </p>
            <p className="mt-3 text-base leading-relaxed">{loadError}</p>
          </div>
        ) : null}

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
                          {currencyFromCents(safeCents(order.totalCents))}
                        </p>
                        <span
                          className={`mt-2 inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${statusClassName(
                            order.status
                          )}`}
                        >
                          {statusLabel(order.status)}
                        </span>
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
