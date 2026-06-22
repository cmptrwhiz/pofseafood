type OrderNotificationItem = {
  name: string;
  price: number;
  quantity: number;
};

type OrderNotificationInput = {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  pickupTime: string | null;
  fulfillmentType: string;
  totalCents: number;
  items: OrderNotificationItem[];
};

type NotificationResult =
  | { ok: true; status: "restaurant_notified" }
  | { ok: true; status: "notification_disabled" }
  | { ok: false; status: "notification_failed"; error: string };

const DEFAULT_NOTIFY_EMAIL = "info@orderplentyoffishseafood.com";
const DEFAULT_FROM_EMAIL =
  "Plenty of Fish Orders <orders@orderplentyoffishseafood.com>";

function dollarsFromCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderItems(items: OrderNotificationItem[]) {
  return items
    .map((item) => {
      const lineTotal = item.price * item.quantity * 100;
      return `${item.quantity}x ${item.name} - ${dollarsFromCents(lineTotal)}`;
    })
    .join("\n");
}

function renderHtml(input: OrderNotificationInput) {
  const itemRows = input.items
    .map((item) => {
      const lineTotal = item.price * item.quantity * 100;
      return `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #dbeafe;">${item.quantity}x ${escapeHtml(item.name)}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #dbeafe; text-align: right;">${dollarsFromCents(lineTotal)}</td>
        </tr>`;
    })
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; max-width: 640px;">
      <p style="text-transform: uppercase; letter-spacing: 0.16em; color: #2563eb; font-weight: 800;">New Direct Order</p>
      <h1 style="margin: 0 0 16px; font-size: 28px;">${escapeHtml(input.customerName)}</h1>
      <p><strong>Phone:</strong> ${escapeHtml(input.customerPhone)}</p>
      ${input.customerEmail ? `<p><strong>Email:</strong> ${escapeHtml(input.customerEmail)}</p>` : ""}
      <p><strong>Pickup:</strong> ${escapeHtml(input.pickupTime || "Not specified")}</p>
      <p><strong>Fulfillment:</strong> ${escapeHtml(input.fulfillmentType)}</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        ${itemRows}
      </table>
      <p style="font-size: 22px; font-weight: 900; margin-top: 20px;">Total: ${dollarsFromCents(input.totalCents)}</p>
      <p style="color: #64748b;">Order ID: ${escapeHtml(input.orderId)}</p>
    </div>`;
}

export async function notifyRestaurantOfOrder(
  input: OrderNotificationInput
): Promise<NotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RESTAURANT_NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL;

  if (!apiKey) {
    console.info("order-notification-disabled", {
      orderId: input.orderId,
      reason: "RESEND_API_KEY is not configured",
    });
    return { ok: true, status: "notification_disabled" };
  }

  const subject = `New pickup order: ${input.customerName} - ${dollarsFromCents(
    input.totalCents
  )}`;
  const text = [
    "New direct order",
    "",
    `Customer: ${input.customerName}`,
    `Phone: ${input.customerPhone}`,
    input.customerEmail ? `Email: ${input.customerEmail}` : null,
    `Pickup: ${input.pickupTime || "Not specified"}`,
    `Fulfillment: ${input.fulfillmentType}`,
    "",
    renderItems(input.items),
    "",
    `Total: ${dollarsFromCents(input.totalCents)}`,
    `Order ID: ${input.orderId}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        text,
        html: renderHtml(input),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        ok: false,
        status: "notification_failed",
        error: `Resend email failed: ${response.status} ${errorText}`,
      };
    }

    return { ok: true, status: "restaurant_notified" };
  } catch (error) {
    return {
      ok: false,
      status: "notification_failed",
      error: error instanceof Error ? error.message : "Unknown email error",
    };
  }
}
