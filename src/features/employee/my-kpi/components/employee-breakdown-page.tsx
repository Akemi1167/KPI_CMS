"use client";

import { KpiResultBreakdownView } from "@/features/kpi/results/components/kpi-result-breakdown-view";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTranslation } from "@/providers/preferences-provider";

interface EmployeeBreakdownPageProps {
  resultId: string;
}

export function EmployeeBreakdownPage({ resultId }: EmployeeBreakdownPageProps) {
  const { user } = useAuth();
  const { dict } = useTranslation();

  return (
    <KpiResultBreakdownView
      resultId={resultId}
      backHref="/employee/my-kpi"
      forbiddenMessage={dict.employee.myKpi.forbidden}
      currentUserId={user?.id}
      employeeMode
    />
  );
}
