"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { kpiEventTypesService } from "@/features/kpi/event-types/services/kpiEventTypesService";
import { PageHeader } from "@/components/cms/page-header";
import { KpiEventTypeForm } from "@/features/kpi/event-types/components/kpi-event-type-form";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { useTranslation } from "@/providers/preferences-provider";
import type { KpiEventType } from "@/types/api";

export default function EditKpiEventTypePage() {
  const params = useParams<{ id: string }>();
  const { dict } = useTranslation();
  const [eventType, setEventType] = useState<KpiEventType | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    kpiEventTypesService
      .findById(params.id)
      .then((res) => setEventType(res.data))
      .catch((err) => setError(getApiErrorMessage(err, dict.errors)));
  }, [params.id, dict.errors]);

  if (error) return <p className="text-[13px] text-danger">{error}</p>;
  if (!eventType) return <p className="text-[13px] text-text-muted">{dict.common.loading}</p>;

  return (
    <div>
      <PageHeader title={dict.kpiEventTypes.editTitle} description={eventType.name} />
      <KpiEventTypeForm eventType={eventType} />
    </div>
  );
}
