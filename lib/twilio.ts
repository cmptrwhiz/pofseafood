const VIP_CONFIRMATION_MESSAGE =
  "POF Seafood: You're officially on the VIP list. Watch for weekly specials, Taco Tuesday and Gumbo Weekend alerts. Reply STOP to unsubscribe or HELP for help.";

type SmsSendResult =
  | { ok: true; status: "sent" | "disabled" }
  | { ok: false; status: "failed"; error: string };

export async function sendVipConfirmationSms(
  to: string
): Promise<SmsSendResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || (!messagingServiceSid && !fromNumber)) {
    return { ok: true, status: "disabled" };
  }

  const body = new URLSearchParams({
    To: to,
    Body: VIP_CONFIRMATION_MESSAGE,
  });

  if (messagingServiceSid) {
    body.set("MessagingServiceSid", messagingServiceSid);
  } else if (fromNumber) {
    body.set("From", fromNumber);
  }

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${accountSid}:${authToken}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );

  if (!response.ok) {
    const error = await response.text().catch(() => "Twilio request failed.");
    return { ok: false, status: "failed", error };
  }

  return { ok: true, status: "sent" };
}
