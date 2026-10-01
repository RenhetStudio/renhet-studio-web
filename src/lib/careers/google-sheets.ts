import { env } from "$env/dynamic/private";
import type { CareerApplication, CareerPosition } from "./types";

type AppsScriptPosition = Partial<CareerPosition> & { slug: string; niceToHave?: string[] };
let positionsCache: { expires: number; value: Promise<CareerPosition[]> } | undefined;

function getUrl() {
  const url = env.GOOGLE_APPS_SCRIPT_URL?.trim();
  if (!url) throw new Error("Google Apps Script careers URL is not configured");
  return url;
}

function getSecret() {
  const secret = env.GOOGLE_APPS_SCRIPT_SECRET?.trim();
  if (!secret) throw new Error("Google Apps Script careers secret is not configured");
  return secret;
}

function lines(value: unknown) {
  return String(value ?? "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function normalizePosition(value: AppsScriptPosition): CareerPosition {
  const list = (value: unknown) => Array.isArray(value) ? value.map(String).map((item) => item.trim()).filter(Boolean) : lines(value);
  return {
    slug: String(value.slug ?? "").trim().toLowerCase(),
    title: String(value.title ?? "").trim(),
    department: String(value.department ?? "Game development").trim(),
    location: String(value.location ?? "Remote").trim(),
    type: String(value.type ?? "Flexible").trim(),
    summary: String(value.summary ?? "").trim(),
    responsibilities: list(value.responsibilities),
    requirements: list(value.requirements),
    niceToHave: list(value.niceToHave),
  };
}

export async function getPublishedPositions(): Promise<CareerPosition[]> {
  if (positionsCache && positionsCache.expires > Date.now()) return positionsCache.value;
  const value = loadPublishedPositions();
  positionsCache = { expires: Date.now() + 300_000, value };
  value.catch(() => { positionsCache = undefined; });
  return value;
}

async function loadPublishedPositions(): Promise<CareerPosition[]> {
  const url = getUrl();
  // Apps Script can take longer to respond when its web app starts cold.
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`Google Apps Script positions request failed (${response.status})`);
  const payload = (await response.json()) as { positions?: AppsScriptPosition[]; error?: string };
  if (payload.error || !Array.isArray(payload.positions)) throw new Error(payload.error || "Invalid positions response");
  return payload.positions.map(normalizePosition).filter((position) => position.title && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(position.slug));
}

export async function appendApplication(application: CareerApplication) {
  const url = getUrl();
  const secret = getSecret();
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, application }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`Google Apps Script application request failed (${response.status})`);
  const payload = (await response.json()) as { ok?: boolean; error?: string };
  if (!payload.ok) throw new Error(payload.error || "Google Apps Script rejected the application");
}
