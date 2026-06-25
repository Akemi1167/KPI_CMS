"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { kpiPeriodsService } from "@/features/kpi/periods/services/kpiPeriodsService";
import { PageHeader } from "@/components/cms/page-header";
import { KpiPeriodForm } from "@/features/kpi/periods/components/kpi-period-form";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { useTranslation } from "@/providers/preferences-provider";
import type { KpiPeriod } from "@/types/api";

export default function EditKpiPeriodPage() {
  const params = useParams<{ id: string }>();
  const { dict } = useTranslation();
  const [period, setPeriod] = useState<KpiPeriod | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    kpiPeriodsService
      .findById(params.id)
      .then((res) => setPeriod(res.data))
      .catch((err) => setError(getApiErrorMessage(err, dict.errors)));
  }, [params.id, dict.errors]);

  if (error) return <p className="text-[13px] text-danger">{error}</p>;
  if (!period) return <p className="text-[13px] text-text-muted">{dict.common.loading}</p>;

  return (
    <div>
      <PageHeader title={dict.kpiPeriods.editTitle} description={period.name} />
      <KpiPeriodForm period={period} />
    </div>
  );
}
