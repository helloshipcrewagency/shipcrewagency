import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase/server";
import type { MenuNode } from "./types";

// The custom header menu is stored as one JSON tree in site_settings under
// "header_menu". When empty/unset, the site uses its built-in default nav.
const MENU_KEY = "header_menu";
export const MENU_TAG = "header-menu";

async function readMenuValue(): Promise<MenuNode[] | null> {
  if (!hasSupabaseConfig()) return null;
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("site_settings")
      .select("value")
      .eq("key", MENU_KEY)
      .maybeSingle();
    if (error || !data) return null;
    const v = (data as { value?: unknown }).value;
    if (typeof v !== "string") return null;
    const arr = JSON.parse(v);
    return Array.isArray(arr) ? (arr as MenuNode[]) : null;
  } catch {
    return null;
  }
}

/** Public, cross-request cached read (busted on save). Null = use default nav. */
export const getHeaderMenu = unstable_cache(
  async (): Promise<MenuNode[] | null> => {
    const menu = await readMenuValue();
    return menu && menu.length ? menu : null;
  },
  ["header-menu"],
  { tags: [MENU_TAG], revalidate: 600 },
);

/** Admin (uncached). */
export async function adminGetMenu(): Promise<MenuNode[]> {
  return (await readMenuValue()) ?? [];
}

export async function adminSaveMenu(nodes: MenuNode[]): Promise<void> {
  await getSupabaseAdmin()
    .from("site_settings")
    .upsert(
      {
        key: MENU_KEY,
        value: JSON.stringify(nodes),
        type: "json",
        group_name: "navigation",
        label: "Header menu",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );
  revalidateTag(MENU_TAG);
}
