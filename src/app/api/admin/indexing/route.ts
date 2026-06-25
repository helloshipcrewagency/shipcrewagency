import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { hasSupabaseConfig } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/seo";
import {
  runIndexScan,
  readIndexReport,
  writeIndexReport,
  submitIndexNow,
  notIndexedUrls,
} from "@/lib/indexing/scan";
import { gscSubmitSitemap, hasGscConfig } from "@/lib/analytics/google";

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
  return NextResponse.json({ report: await readIndexReport() });
}

export async function POST(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const action = new URL(req.url).searchParams.get("action") ?? "scan";

  if (action === "scan") {
    const report = await runIndexScan();
    if (hasSupabaseConfig()) {
      try {
        await writeIndexReport(report);
      } catch {
        /* still return result */
      }
    }
    return NextResponse.json({ report });
  }

  if (action === "indexnow") {
    const report = await readIndexReport();
    const urls = report ? notIndexedUrls(report) : [];
    if (!urls.length) {
      return NextResponse.json(
        { error: "Nothing to submit. Run a scan first." },
        { status: 400 },
      );
    }
    const result = await submitIndexNow(urls);
    return NextResponse.json(result);
  }

  if (action === "sitemap") {
    if (!hasGscConfig()) {
      return NextResponse.json(
        { error: "Connect Google Search Console to submit the sitemap." },
        { status: 400 },
      );
    }
    const ok = await gscSubmitSitemap(`${siteUrl()}/sitemap.xml`);
    return NextResponse.json({ ok });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
