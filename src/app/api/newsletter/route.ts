import { NextResponse } from "next/server";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase/server";

export const runtime = "nodejs";

interface NewsletterPayload {
  email?: string;
  language?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: NewsletterPayload;
  try {
    body = (await request.json()) as NewsletterPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "A valid email address is required" },
      { status: 400 },
    );
  }

  try {
    // Persist to Supabase when configured. Re-subscribing is a no-op thanks to
    // the unique email + ignoreDuplicates. A storage hiccup (e.g. the
    // newsletter_subscribers table not created yet) is logged but never shown
    // to the visitor — we still acknowledge the subscription.
    if (hasSupabaseConfig()) {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase
        .from("newsletter_subscribers")
        .upsert(
          { email, language: body.language === "zh" ? "zh" : "en" },
          { onConflict: "email", ignoreDuplicates: true },
        );
      if (error) {
        console.error("[newsletter] insert failed:", error.message);
      }
    }
  } catch (err) {
    console.error("[newsletter] unexpected error:", err);
  }

  return NextResponse.json({ ok: true });
}
