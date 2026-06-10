import type { Metadata } from "next";
import { TeamPage } from "@/components/pages/TeamPage";
import { buildMetadata } from "@/lib/seo";
import { getDict } from "@/i18n";

export function generateMetadata(): Metadata {
  const t = getDict("zh");
  return buildMetadata({
    lang: "zh",
    title: t.team.metaTitle,
    description: t.team.metaDescription,
    path: "team",
  });
}

export default function Page() {
  return <TeamPage lang="zh" />;
}
