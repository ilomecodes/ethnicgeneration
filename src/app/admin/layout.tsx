import AdminShell from "@/components/admin/Shell";

export const metadata = { title: "Admin — Ethnicgeneration" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
