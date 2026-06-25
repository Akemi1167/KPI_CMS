"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authService } from "@/features/auth/services/authService";
import { PageHeader } from "@/components/cms/page-header";
import { SurfaceCard } from "@/components/cms/surface-card";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { useTranslation } from "@/providers/preferences-provider";

export default function DashboardPage() {
  const { dict } = useTranslation();
  const [health, setHealth] = useState<{ status: string; name: string; version: string } | null>(
    null,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    authService
      .health()
      .then((res) => setHealth(res.data))
      .catch((err) => setError(getApiErrorMessage(err, dict.errors, dict.errors.apiUnreachable)));
  }, [dict.errors]);

  return (
    <div>
      <PageHeader title={dict.dashboard.title} description={dict.dashboard.description} />

      <div className="grid gap-4 md:grid-cols-2">
        <SurfaceCard>
          <h3 className="text-[16px] font-semibold text-text-primary">{dict.dashboard.apiStatus}</h3>
          {error ? (
            <p className="mt-2 text-[13px] text-danger">{error}</p>
          ) : health ? (
            <dl className="mt-3 space-y-2 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-text-secondary">{dict.common.status}</dt>
                <dd className="font-medium text-success">{health.status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-secondary">{dict.dashboard.apiName}</dt>
                <dd className="font-medium text-text-primary">{health.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-secondary">{dict.dashboard.apiVersion}</dt>
                <dd className="font-medium text-text-primary">{health.version}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-2 text-[13px] text-text-muted">{dict.dashboard.checking}</p>
          )}
        </SurfaceCard>

        <SurfaceCard>
          <h3 className="text-[16px] font-semibold text-text-primary">{dict.dashboard.workflow}</h3>
          <ol className="mt-3 list-decimal space-y-1 pl-4 text-[13px] text-text-secondary">
            {dict.dashboard.workflowSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <Link href="/admin/kpi-events" className="mt-4 inline-block">
            <Button size="sm">{dict.dashboard.enterKpiEvent}</Button>
          </Link>
        </SurfaceCard>
      </div>
    </div>
  );
}
