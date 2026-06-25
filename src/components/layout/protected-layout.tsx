"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AdminLayout } from "@/components/layout/admin-layout";
import { PageLoading } from "@/components/layout/page-loading";
import { isAdmin, isEmployee } from "@/lib/auth/roles";

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (isEmployee(user)) {
      router.replace("/employee/my-kpi");
    }
  }, [isLoading, user, router]);

  if (isLoading) return <PageLoading />;
  if (!user || !isAdmin(user)) return null;

  return <AdminLayout user={user}>{children}</AdminLayout>;
}
