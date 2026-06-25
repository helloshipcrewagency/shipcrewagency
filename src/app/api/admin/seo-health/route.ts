import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { hasSupabaseConfig } from "@/lib/supabase/server";
import { runSeoAudit } from "@/lib/seo-audit/audit";
import { readSeoAudit, writeSeoAudit } from "@/lib/seo-audit/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function guard() {
  const session = await readSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  return NextResponse.json({ audit: await readSeoAudit() });
}

export async function POST() {
  const denied = await guard();
  if (denied) return denied;
  const audit = await runSeoAudit();
  if (hasSupabaseConfig()) {
    try {
      await writeSeoAudit(audit);
    } catch {
      /* still return the fresh result even if persistence fails */
    }
  }
  return NextResponse.json({ audit });
}
