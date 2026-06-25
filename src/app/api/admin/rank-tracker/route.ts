import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { siteUrl } from "@/lib/seo";
import {
  readKeywords,
  writeKeywords,
  addKeyword,
  removeKeyword,
} from "@/lib/rank/store";
import { hasRankProvider, checkRank } from "@/lib/rank/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function guard() {
  const session = await readSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

function meta() {
  return { provider: hasRankProvider(), domain: new URL(siteUrl()).host };
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  return NextResponse.json({ keywords: await readKeywords(), ...meta() });
}

export async function POST(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const action = new URL(req.url).searchParams.get("action");

  if (action === "check") {
    if (!hasRankProvider()) {
      return NextResponse.json(
        { error: "Add a rank API key (SERPAPI_KEY) to check positions." },
        { status: 400 },
      );
    }
    const list = await readKeywords();
    const now = new Date().toISOString();
    for (const k of list) {
      const r = await checkRank(k.keyword);
      k.prevPosition = k.position;
      k.position = r.position;
      k.url = r.url;
      k.checkedAt = now;
    }
    await writeKeywords(list);
    return NextResponse.json({ keywords: list, ...meta() });
  }

  // Add a keyword.
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }
  const keyword = String(body.keyword ?? "").trim();
  if (!keyword) {
    return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
  }
  const volNum = Number(body.volume);
  const keywords = await addKeyword(
    keyword,
    Number.isFinite(volNum) && volNum > 0 ? volNum : null,
  );
  return NextResponse.json({ keywords, ...meta() });
}

export async function DELETE(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  const id = new URL(req.url).searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  return NextResponse.json({ keywords: await removeKeyword(id), ...meta() });
}
