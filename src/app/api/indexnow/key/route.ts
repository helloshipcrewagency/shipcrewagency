import { NextResponse } from "next/server";
import { getIndexNowKey } from "@/lib/indexing/scan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// IndexNow requires the key to be retrievable on the same host. We serve it
// here and pass this URL as `keyLocation` when submitting.
export async function GET() {
  const key = await getIndexNowKey();
  if (!key) {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(key, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
