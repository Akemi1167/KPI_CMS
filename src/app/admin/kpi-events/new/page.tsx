"use client";

import { PageHeader } from "@/components/cms/page-header";
import { KpiEventForm } from "@/features/kpi/events/components/kpi-event-form";
import { useTranslation } from "@/providers/preferences-provider";

export default function NewKpiEventPage() {
  const { dict } = useTranslation();

  return (
    <div>
      <PageHeader title={dict.kpiEvents.createTitle} description={dict.kpiEvents.sectionDesc} />
      <KpiEventForm />
    </div>
  );
}
