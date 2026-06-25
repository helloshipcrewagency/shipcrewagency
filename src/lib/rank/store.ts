import "server-only";
import crypto from "node:crypto";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase/server";

export type Keyword = {
  id: string;
  keyword: string;
  volume: number | null;
  position: number | null; // 1..100, or null = not in top 100
  prevPosition: number | null;
  url: string | null;
  checkedAt: string | null;
};

const KEY = "rank_keywords";

export async function readKeywords(): Promise<Keyword[]> {
  if (!hasSupabaseConfig()) return [];
  try {
    const { data } = await getSupabaseAdmin()
      .from("site_settings")
      .select("value")
      .eq("key", KEY)
      .maybeSingle();
    const v = (data as { value?: unknown } | null)?.value;
    if (typeof v !== "string") return [];
    const arr = JSON.parse(v);
    return Array.isArray(arr) ? (arr as Keyword[]) : [];
  } catch {
    return [];
  }
}

export async function writeKeywords(list: Keyword[]): Promise<void> {
  await getSupabaseAdmin()
    .from("site_settings")
    .upsert(
      {
        key: KEY,
        value: JSON.stringify(list),
        type: "json",
        group_name: "seo",
        label: "Rank tracker keywords",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );
}

export async function addKeyword(
  keyword: string,
  volume: number | null,
): Promise<Keyword[]> {
  const list = await readKeywords();
  const exists = list.some(
    (k) => k.keyword.toLowerCase() === keyword.toLowerCase(),
  );
  if (!exists) {
    list.push({
      id: crypto.randomUUID().slice(0, 8),
      keyword,
      volume,
      position: null,
      prevPosition: null,
      url: null,
      checkedAt: null,
    });
    await writeKeywords(list);
  }
  return list;
}

export async function removeKeyword(id: string): Promise<Keyword[]> {
  const list = (await readKeywords()).filter((k) => k.id !== id);
  await writeKeywords(list);
  return list;
}
