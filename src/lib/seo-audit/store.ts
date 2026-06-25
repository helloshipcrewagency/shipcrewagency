import "server-only";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase/server";
import type { SeoAudit } from "./audit";

const KEY = "seo_audit";

export async function readSeoAudit(): Promise<SeoAudit | null> {
  if (!hasSupabaseConfig()) return null;
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("site_settings")
      .select("value")
      .eq("key", KEY)
      .maybeSingle();
    if (error || !data) return null;
    const v = (data as { value?: unknown }).value;
    if (typeof v !== "string") return null;
    return JSON.parse(v) as SeoAudit;
  } catch {
    return null;
  }
}

export async function writeSeoAudit(audit: SeoAudit): Promise<void> {
  await getSupabaseAdmin()
    .from("site_settings")
    .upsert(
      {
        key: KEY,
        value: JSON.stringify(audit),
        type: "json",
        group_name: "seo",
        label: "SEO audit",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );
}
