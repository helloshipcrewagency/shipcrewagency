import "server-only";
import crypto from "node:crypto";

// ---------------------------------------------------------------------------
// Minimal Google service-account client. Signs a JWT with the built-in crypto
// module and exchanges it for an access token — no external SDK needed. Reads
// from GA4 (Data API) and Search Console. Everything is optional: when the env
// vars are missing the dashboard shows a "connect" state instead of erroring.
// ---------------------------------------------------------------------------

const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
].join(" ");

export function hasGaConfig(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GA4_PROPERTY_ID,
  );
}

export function hasGscConfig(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GSC_SITE_URL,
  );
}

export function hasAnalyticsConfig(): boolean {
  return hasGaConfig() || hasGscConfig();
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

let cachedToken: { value: string; exp: number } | null = null;

async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.exp - 60 > now) return cachedToken.value;

  const email = process.env.GOOGLE_CLIENT_EMAIL as string;
  const key = (process.env.GOOGLE_PRIVATE_KEY as string).replace(/\\n/g, "\n");

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({
      iss: email,
      scope: SCOPES,
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }),
  );
  const signingInput = `${header}.${claim}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signingInput);
  const signature = base64url(signer.sign(key));
  const assertion = `${signingInput}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });
  const data = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    error_description?: string;
  };
  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description || `token error (${res.status})`);
  }
  cachedToken = {
    value: data.access_token,
    exp: now + (data.expires_in ?? 3600),
  };
  return data.access_token;
}

// ---- GA4 Data API ----------------------------------------------------------
export type GaReportRequest = {
  dimensions?: { name: string }[];
  metrics: { name: string }[];
  dateRanges: { startDate: string; endDate: string }[];
  orderBys?: unknown[];
  limit?: number;
};

export type GaRow = {
  dimensionValues?: { value: string }[];
  metricValues?: { value: string }[];
};

export async function ga4RunReport(
  req: GaReportRequest,
): Promise<{ rows: GaRow[] }> {
  const token = await getAccessToken();
  const id = process.env.GA4_PROPERTY_ID as string;
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${id}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
      cache: "no-store",
    },
  );
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`GA4 ${res.status}: ${t.slice(0, 180)}`);
  }
  const data = (await res.json()) as { rows?: GaRow[] };
  return { rows: data.rows ?? [] };
}

// ---- Search Console --------------------------------------------------------
export type GscRow = {
  keys?: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export async function gscQuery(body: {
  startDate: string;
  endDate: string;
  dimensions: string[];
  rowLimit?: number;
}): Promise<GscRow[]> {
  const token = await getAccessToken();
  const site = encodeURIComponent(process.env.GSC_SITE_URL as string);
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`GSC ${res.status}: ${t.slice(0, 180)}`);
  }
  const data = (await res.json()) as { rows?: GscRow[] };
  return data.rows ?? [];
}
