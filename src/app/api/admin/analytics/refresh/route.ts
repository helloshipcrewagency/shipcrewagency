import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { readSession } from "@/lib/auth/session";
import { ANALYTICS_TAG } from "@/lib/analytics/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Busts the 5-minute analytics cache so the next load pulls fresh figures
// straight from Google. Used by the dashboard's "Clear Cache" button.
export async function POST() {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidateTag(ANALYTICS_TAG);
  return NextResponse.json({ ok: true });
}
