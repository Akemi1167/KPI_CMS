"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { EmployeeLayout } from "@/components/layout/employee-layout";
import { PageLoading } from "@/components/layout/page-loading";
import { isAdmin, isEmployee } from "@/lib/auth/roles";

export function EmployeeProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (isAdmin(user)) {
      router.replace("/admin");
    }
  }, [isLoading, user, router]);

  if (isLoading) return <PageLoading />;
  if (!user || !isEmployee(user)) return null;

  return <EmployeeLayout user={user}>{children}</EmployeeLayout>;
}
