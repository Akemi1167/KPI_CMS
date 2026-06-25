"use client";

import { PageHeader } from "@/components/cms/page-header";
import { KpiPeriodForm } from "@/features/kpi/periods/components/kpi-period-form";
import { useTranslation } from "@/providers/preferences-provider";

export default function NewKpiPeriodPage() {
  const { dict } = useTranslation();

  return (
    <div>
      <PageHeader title={dict.kpiPeriods.createTitle} />
      <KpiPeriodForm />
    </div>
  );
}
