"use client";

import { PageHeader } from "@/components/cms/page-header";
import { KpiEventTypeForm } from "@/features/kpi/event-types/components/kpi-event-type-form";
import { useTranslation } from "@/providers/preferences-provider";

export default function NewKpiEventTypePage() {
  const { dict } = useTranslation();

  return (
    <div>
      <PageHeader title={dict.kpiEventTypes.createTitle} />
      <KpiEventTypeForm />
    </div>
  );
}
