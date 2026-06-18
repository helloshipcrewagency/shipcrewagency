import ServiceEditor from "@/components/admin/ServiceEditor";

export default async function EditServicePage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const { slug } = await searchParams;
  return <ServiceEditor slug={slug} />;
}
