type HeaderReader = {
  get(name: string): string | null;
};

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

declare global {
  // eslint-disable-next-line no-var
  var pofRateLimitBuckets: Map<string, RateLimitBucket> | undefined;
}

const buckets = globalThis.pofRateLimitBuckets ?? new Map<string, RateLimitBucket>();

if (process.env.NODE_ENV !== "production") {
  globalThis.pofRateLimitBuckets = buckets;
}

export function getClientIp(headers: HeaderReader) {
  const forwardedFor = headers.get("x-forwarded-for");
  return (
    forwardedFor?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function checkRateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  buckets.set(key, existing);
  return { allowed: true, retryAfterSeconds: 0 };
}

export function hasFilledHoneypot(fields: Array<string | null | undefined>) {
  return fields.some((field) => Boolean(field?.trim()));
}

export async function verifyTurnstileToken({
  token,
  ip,
}: {
  token?: string | null;
  ip: string;
}) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return { ok: true, skipped: true };
  }

  if (!token) {
    return { ok: false, skipped: false, error: "missing-token" };
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);

  if (ip !== "unknown") {
    formData.append("remoteip", ip);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    return { ok: false, skipped: false, error: "verification-request-failed" };
  }

  const result = (await response.json()) as { success?: boolean };
  return {
    ok: Boolean(result.success),
    skipped: false,
    error: result.success ? null : "verification-failed",
  };
}
