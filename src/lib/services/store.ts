import "server-only";
import { cache } from "react";
import { unstable_cache, revalidateTag } from "next/cache";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase/server";
import { getStaticMeta, getStaticPage } from "./static";
import type { ServiceMeta, ServicePageData } from "./types";

// Service pages live in the existing `site_settings` table:
//   svc:index        -> JSON array of ServiceMeta (lightweight, for nav/list)
//   svc:page:<slug>  -> JSON ServicePageData (the full page)
// Reads are DB-first and fall back to the bundled static content, so the public
// site keeps working before anything is seeded.

const INDEX_KEY = "svc:index";
const pageKey = (slug: string) => `svc:page:${slug}`;
export const SERVICES_TAG = "service-pages";

async function readValue(key: string): Promise<string | null> {
  if (!hasSupabaseConfig()) return null;
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error || !data) return null;
    const v = (data as { value?: unknown }).value;
    return typeof v === "string" ? v : null;
  } catch {
    return null;
  }
}

function parseIndex(raw: string | null): ServiceMeta[] | null {
  if (!raw) return null;
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr as ServiceMeta[];
  } catch {
    /* ignore */
  }
  return null;
}

const byOrder = (a: ServiceMeta, b: ServiceMeta) => a.order - b.order;

// ---------------- public reads (request-deduped) ----------------

/** All service pages (published + drafts), DB-first with static fallback. */
export const getServiceIndex = cache(async (): Promise<ServiceMeta[]> => {
  const fromDb = parseIndex(await readValue(INDEX_KEY));
  const list = fromDb && fromDb.length ? fromDb : getStaticMeta();
  return [...list].sort(byOrder);
});

/** One full page, DB-first with static fallback (null if it doesn't exist). */
export const getServicePage = cache(
  async (slug: string): Promise<ServicePageData | null> => {
    const raw = await readValue(pageKey(slug));
    if (raw) {
      try {
        return JSON.parse(raw) as ServicePageData;
      } catch {
        /* ignore */
      }
    }
    return getStaticPage(slug);
  },
);

/** Published pages only, cross-request cached so the nav doesn't make every
 *  page dynamic. Busted on admin save via revalidateTag(SERVICES_TAG). */
export const getNavServices = unstable_cache(
  async (): Promise<ServiceMeta[]> => {
    const fromDb = parseIndex(await readValue(INDEX_KEY));
    const list = fromDb && fromDb.length ? fromDb : getStaticMeta();
    return [...list].filter((m) => m.published).sort(byOrder);
  },
  ["nav-services"],
  { tags: [SERVICES_TAG], revalidate: 600 },
);

// ---------------- admin reads/writes (service-role, uncached) ----------------

async function rawIndex(): Promise<ServiceMeta[] | null> {
  return parseIndex(await readValue(INDEX_KEY));
}

/** Admin list — DB index, or the static defaults if nothing is seeded yet. */
export async function adminListServices(): Promise<ServiceMeta[]> {
  const list = (await rawIndex()) ?? getStaticMeta();
  return [...list].sort(byOrder);
}

export async function adminGetService(
  slug: string,
): Promise<ServicePageData | null> {
  const raw = await readValue(pageKey(slug));
  if (raw) {
    try {
      return JSON.parse(raw) as ServicePageData;
    } catch {
      /* ignore */
    }
  }
  return getStaticPage(slug);
}

async function writeValue(key: string, value: string, label: string) {
  await getSupabaseAdmin()
    .from("site_settings")
    .upsert(
      {
        key,
        value,
        type: "json",
        group_name: "services",
        label,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );
}

function metaOf(p: ServicePageData): ServiceMeta {
  return {
    slug: p.slug,
    order: p.order,
    published: p.published,
    navEn: p.navEn,
    navZh: p.navZh,
    titleEn: p.titleEn,
    titleZh: p.titleZh,
    metaDescEn: p.metaDescEn,
    metaDescZh: p.metaDescZh,
  };
}

export async function adminSaveService(p: ServicePageData): Promise<void> {
  await writeValue(pageKey(p.slug), JSON.stringify(p), `Service page: ${p.slug}`);
  const index = (await rawIndex()) ?? getStaticMeta();
  const next = index
    .filter((m) => m.slug !== p.slug)
    .concat(metaOf(p))
    .sort(byOrder);
  await writeValue(INDEX_KEY, JSON.stringify(next), "Service pages index");
  revalidateTag(SERVICES_TAG);
}

export async function adminDeleteService(slug: string): Promise<void> {
  await getSupabaseAdmin()
    .from("site_settings")
    .delete()
    .eq("key", pageKey(slug));
  const index = (await rawIndex()) ?? getStaticMeta();
  const next = index.filter((m) => m.slug !== slug);
  await writeValue(INDEX_KEY, JSON.stringify(next), "Service pages index");
  revalidateTag(SERVICES_TAG);
}

export async function serviceSlugExists(slug: string): Promise<boolean> {
  const index = (await rawIndex()) ?? getStaticMeta();
  return index.some((m) => m.slug === slug);
}
