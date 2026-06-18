import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readSession } from "@/lib/auth/session";
import { hasSupabaseConfig } from "@/lib/supabase/server";
import { adminGetMenu, adminSaveMenu } from "@/lib/menu/store";
import type { MenuNode } from "@/lib/menu/types";
import { adminListServices } from "@/lib/services/store";
import { getDict } from "@/i18n";

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
        { error: "Supabase is not configured on the server." },
        { status: 503 },
      ),
    };
  }
  return { ok: true };
}

type PaletteItem = {
  labelEn: string;
  labelZh: string;
  url: string;
  external?: boolean;
};
type PaletteGroup = { group: string; items: PaletteItem[] };

type FlatLink = { to: string; label: string; external: boolean };
type AnyNav = {
  label: string;
  to?: string;
  external?: boolean;
  children?: AnyNav[];
};

function flatten(items: AnyNav[], out: FlatLink[]) {
  for (const it of items) {
    const to = it.to ?? "";
    if (to) out.push({ to, label: it.label, external: Boolean(it.external) });
    if (it.children) flatten(it.children, out);
  }
}

function collect(dict: ReturnType<typeof getDict>): FlatLink[] {
  const out: FlatLink[] = [];
  flatten(dict.nav as AnyNav[], out);
  flatten(dict.footer.company as AnyNav[], out);
  flatten(dict.footer.categories as AnyNav[], out);
  return out;
}

/** Build the palette of pages an editor can drop into the menu. */
async function buildPalette(): Promise<PaletteGroup[]> {
  const en = collect(getDict("en"));
  const zh = collect(getDict("zh"));
  const zhMap = new Map(zh.map((x) => [x.to, x.label]));

  const seen = new Set<string>();
  const sitePages: PaletteItem[] = [];
  const resources: PaletteItem[] = [];
  for (const x of en) {
    if (seen.has(x.to)) continue;
    seen.add(x.to);
    const item: PaletteItem = {
      labelEn: x.label,
      labelZh: zhMap.get(x.to) ?? x.label,
      url: x.to,
      external: x.external || undefined,
    };
    if (x.external) {
      resources.push(item);
    } else if (!x.to.startsWith("services/")) {
      sitePages.push(item);
    }
  }

  const services = await adminListServices();
  const servicePages: PaletteItem[] = services.map((m) => ({
    labelEn: m.navEn,
    labelZh: m.navZh || m.navEn,
    url: `services/${m.slug}`,
  }));

  const groups: PaletteGroup[] = [{ group: "Site pages", items: sitePages }];
  if (servicePages.length)
    groups.push({ group: "Service pages", items: servicePages });
  if (resources.length) groups.push({ group: "Resources", items: resources });
  return groups;
}

// ---- incoming-tree sanitiser ----------------------------------------------
let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `n${idCounter}_${idCounter * 7 + 3}`;
}

function sanitize(input: unknown, depth = 0): MenuNode[] {
  if (!Array.isArray(input) || depth > 8) return [];
  const out: MenuNode[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const labelEn = typeof r.labelEn === "string" ? r.labelEn.trim() : "";
    const labelZh = typeof r.labelZh === "string" ? r.labelZh.trim() : "";
    if (!labelEn && !labelZh) continue;
    const url = typeof r.url === "string" ? r.url.trim() : "";
    const external = Boolean(r.external);
    const id =
      typeof r.id === "string" && r.id ? r.id.slice(0, 40) : nextId();
    const node: MenuNode = {
      id,
      labelEn: labelEn || labelZh,
      labelZh: labelZh || labelEn,
      url: external ? url : url.replace(/^\/+/, ""),
      external,
    };
    const children = sanitize(r.children, depth + 1);
    if (children.length) node.children = children;
    out.push(node);
  }
  return out;
}

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const [menu, palette] = await Promise.all([adminGetMenu(), buildPalette()]);
  return NextResponse.json({ menu, palette });
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

  const nodes = sanitize(body.menu);
  await adminSaveMenu(nodes);
  // nav is rendered in the root layout for both languages.
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, menu: nodes });
}
