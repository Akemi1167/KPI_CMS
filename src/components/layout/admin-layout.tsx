import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import type { User } from "@/types/api";

export function AdminLayout({ user, children }: { user: User; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg-page">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar user={user} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
