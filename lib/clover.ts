import { getCloverEnv } from "./env";

type CloverTokenResponse = {
  access_token: string;
  refresh_token?: string;
  merchant_id?: string;
  employee_id?: string;
  expires_in?: number;
};

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithCloverRetry(
  input: URL | string,
  init: RequestInit,
  retries = 2
) {
  let lastResponse: Response | null = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const response = await fetch(input, init);

    if (response.status !== 429) {
      return response;
    }

    lastResponse = response;

    if (attempt < retries) {
      const retryAfterHeader = response.headers.get("retry-after");
      const retryAfterSeconds = retryAfterHeader
        ? Number.parseInt(retryAfterHeader, 10)
        : Number.NaN;
      const delayMs = Number.isFinite(retryAfterSeconds)
        ? retryAfterSeconds * 1000
        : 1200 * (attempt + 1);

      await sleep(delayMs);
    }
  }

  return lastResponse as Response;
}

export function buildCloverInstallUrl() {
  const env = getCloverEnv();
  const url = new URL("/oauth/authorize", env.CLOVER_BASE_URL);
  url.searchParams.set("client_id", env.CLOVER_APP_ID);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", env.CLOVER_REDIRECT_URI);
  return url.toString();
}

export async function exchangeCloverCodeForToken(code: string) {
  const env = getCloverEnv();
  const url = new URL("/oauth/token", env.CLOVER_BASE_URL);
  const payload = new URLSearchParams({
    client_id: env.CLOVER_APP_ID,
    client_secret: env.CLOVER_APP_SECRET,
    code,
    redirect_uri: env.CLOVER_REDIRECT_URI,
  });

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Clover token exchange failed: ${errorText}`);
  }

  return (await response.json()) as CloverTokenResponse;
}

export async function fetchCloverMerchantProfile(
  merchantId: string,
  accessToken: string
) {
  const env = getCloverEnv();
  const url = new URL(`/v3/merchants/${merchantId}`, env.CLOVER_BASE_URL);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Clover merchant fetch failed: ${errorText}`);
  }

  return response.json() as Promise<{ id: string; name?: string }>;
}

export async function fetchCloverMenuSnapshot(
  merchantId: string,
  accessToken: string
) {
  const env = getCloverEnv();
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/json",
  };

  const categoriesResponse = await fetchWithCloverRetry(
    new URL(`/v3/merchants/${merchantId}/categories`, env.CLOVER_BASE_URL),
    {
      headers,
      cache: "no-store",
    }
  );

  const itemsResponse = await fetchWithCloverRetry(
    new URL(`/v3/merchants/${merchantId}/items`, env.CLOVER_BASE_URL),
    {
      headers,
      cache: "no-store",
    }
  );

  if (!categoriesResponse.ok || !itemsResponse.ok) {
    const [categoriesErrorText, itemsErrorText] = await Promise.all([
      categoriesResponse.ok ? Promise.resolve("") : categoriesResponse.text(),
      itemsResponse.ok ? Promise.resolve("") : itemsResponse.text(),
    ]);

    throw new Error(
      `Clover menu fetch failed: categories ${categoriesResponse.status} ${categoriesErrorText}; items ${itemsResponse.status} ${itemsErrorText}`
    );
  }

  return {
    categories: await categoriesResponse.json(),
    items: await itemsResponse.json(),
  };
}
