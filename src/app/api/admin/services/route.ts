import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readSession } from "@/lib/auth/session";
import { hasSupabaseConfig } from "@/lib/supabase/server";
import {
  adminListServices,
  adminGetService,
  adminSaveService,
  adminDeleteService,
  serviceSlugExists,
} from "@/lib/services/store";
import type { ServicePageData } from "@/lib/services/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin(): Promise<
  { ok: true } | { ok: false; response: NextResponse }
> {
  const session = await readSession();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  if (!hasSupabaseConfig()) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Supabase is not configured on the server.", items: [] },
        { status: 503 },
      ),
    };
  }
  return { ok: true };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function refresh(slug?: string) {
  // nav lives in the layout; pages render dynamically but revalidate anyway.
  revalidatePath("/", "layout");
  revalidatePath("/services");
  revalidatePath("/zh/services");
  if (slug) {
    revalidatePath(`/services/${slug}`);
    revalidatePath(`/zh/services/${slug}`);
  }
}

function normalize(body: Record<string, unknown>, slug: string): ServicePageData {
  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string) : "");
  const orderNum = Number(body.order);
  return {
    slug,
    order: Number.isFinite(orderNum) ? orderNum : 0,
    published: body.published === undefined ? true : Boolean(body.published),
    navEn: str("navEn").trim(),
    navZh: str("navZh").trim(),
    titleEn: str("titleEn").trim(),
    titleZh: str("titleZh").trim(),
    metaDescEn: str("metaDescEn").trim(),
    metaDescZh: str("metaDescZh").trim(),
    bodyEn: str("bodyEn"),
    bodyZh: str("bodyZh"),
    css: str("css"),
    scriptEn: str("scriptEn"),
    scriptZh: str("scriptZh"),
  };
}

export async function GET(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const slug = new URL(req.url).searchParams.get("slug");
  if (slug) {
    const page = await adminGetService(slug);
    if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(page);
  }
  return NextResponse.json({ items: await adminListServices() });
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slug = slugify(String(body.slug ?? "")) || slugify(String(body.navEn ?? ""));
  if (!slug) {
    return NextResponse.json(
      { error: "A slug (or English nav label) is required." },
      { status: 400 },
    );
  }
  if (!String(body.navEn ?? "").trim()) {
    return NextResponse.json(
      { error: "The English nav label is required." },
      { status: 400 },
    );
  }
  if (await serviceSlugExists(slug)) {
    return NextResponse.json(
      { error: "A service page with this slug already exists." },
      { status: 409 },
    );
  }

  const page = normalize(body, slug);
  await adminSaveService(page);
  refresh(slug);
  return NextResponse.json(page, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slug = slugify(String(body.slug ?? ""));
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }
  const page = normalize(body, slug);
  await adminSaveService(page);
  refresh(slug);
  return NextResponse.json(page);
}

export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }
  await adminDeleteService(slug);
  refresh(slug);
  return NextResponse.json({ ok: true });
}
