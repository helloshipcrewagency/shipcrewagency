import type { Metadata } from "next";
import { verifySession } from "@/lib/auth/dal";
import { AdminUIProvider } from "@/components/admin/AdminUI";
import { adminListServices } from "@/lib/services/store";
import AdminShell from "./AdminShell";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  const services = await adminListServices()
    .then((list) => list.map((s) => ({ slug: s.slug, label: s.navEn || s.slug })))
    .catch(() => []);

  return (
    <AdminUIProvider>
      <AdminShell userEmail={session.email} services={services}>
        {children}
      </AdminShell>
    </AdminUIProvider>
  );
}
