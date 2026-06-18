import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "@/components/pages/ServicePage";
import { buildMetadata } from "@/lib/seo";
import { getServiceIndex, getServicePage } from "@/lib/services/store";
import { getDict } from "@/i18n";

// Service pages are editable in the admin (and new ones can be added), so they
// render dynamically from the database (with a static fallback).
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = (await getServiceIndex()).find((m) => m.slug === slug);
  const dictS = getDict("en").services[slug];
  if (!meta && !dictS) return {};
  return buildMetadata({
    lang: "en",
    title: meta?.titleEn || dictS?.metaTitle || slug,
    description: meta?.metaDescEn || dictS?.metaDescription || "",
    path: `services/${slug}`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getServicePage(slug);
  if (!page) notFound();
  return <ServicePage lang="en" slug={slug} />;
}
