import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "@/components/pages/ServicePage";
import { buildMetadata } from "@/lib/seo";
import { getServiceIndex, getServicePage } from "@/lib/services/store";
import { getDict } from "@/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = (await getServiceIndex()).find((m) => m.slug === slug);
  const dictS = getDict("zh").services[slug];
  if (!meta && !dictS) return {};
  return buildMetadata({
    lang: "zh",
    title: meta?.titleZh || dictS?.metaTitle || slug,
    description: meta?.metaDescZh || dictS?.metaDescription || "",
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
  return <ServicePage lang="zh" slug={slug} />;
}
