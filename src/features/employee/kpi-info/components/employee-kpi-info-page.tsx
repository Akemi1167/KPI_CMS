"use client";

import { useCallback, useEffect, useState } from "react";
import { employeePortalService } from "@/features/employee/services/employeePortalService";
import { PageHeader } from "@/components/cms/page-header";
import { SurfaceCard } from "@/components/cms/surface-card";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/cms/data-table";
import { EmptyState } from "@/components/cms/empty-state";
import { Badge } from "@/components/ui/badge";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { formatKpiPoint } from "@/lib/formatters/kpi";
import { useTranslation } from "@/providers/preferences-provider";
import type { KpiEventType } from "@/types/api";

export function EmployeeKpiInfoPage() {
  const { dict } = useTranslation();
  const info = dict.employee.kpiInfo;
  const [items, setItems] = useState<KpiEventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await employeePortalService.getEventTypes();
      setItems(res.data);
    } catch (err) {
      setError(getApiErrorMessage(err, dict.errors));
    } finally {
      setLoading(false);
    }
  }, [dict.errors]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <PageHeader title={info.title} description={info.description} />

      {error && (
        <div className="rounded-md border border-danger/30 bg-danger-subtle px-4 py-3 text-[13px] text-danger">
          {error}
        </div>
      )}

      <SurfaceCard>
        <h2 className="text-[16px] font-semibold text-text-primary">{info.eventTypesTitle}</h2>
        <p className="mt-1 text-[13px] text-text-secondary">{info.eventTypesDesc}</p>

        <div className="mt-4">
          {loading ? (
            <p className="text-[13px] text-text-muted">{dict.common.loading}</p>
          ) : items.length === 0 ? (
            <EmptyState description={dict.kpiEventTypes.empty} />
          ) : (
            <DataTable>
              <DataTableHead>
                <DataTableHeaderCell>{dict.common.code}</DataTableHeaderCell>
                <DataTableHeaderCell>{dict.common.name}</DataTableHeaderCell>
                <DataTableHeaderCell>{dict.kpiEventTypes.fieldKind}</DataTableHeaderCell>
                <DataTableHeaderCell>{dict.kpiEventTypes.defaultPoints}</DataTableHeaderCell>
                <DataTableHeaderCell>{dict.common.description}</DataTableHeaderCell>
              </DataTableHead>
              <DataTableBody>
                {items.map((item) => (
                  <DataTableRow key={item.id}>
                    <DataTableCell className="font-medium">{item.code}</DataTableCell>
                    <DataTableCell>{item.name}</DataTableCell>
                    <DataTableCell>
                      <Badge variant={item.eventKind === "BONUS" ? "success" : "danger"}>
                        {item.eventKind}
                      </Badge>
                    </DataTableCell>
                    <DataTableCell
                      className={item.defaultPoints >= 0 ? "text-success" : "text-danger"}
                    >
                      {formatKpiPoint(item.defaultPoints)}
                    </DataTableCell>
                    <DataTableCell className="text-text-secondary">
                      {item.description ?? "—"}
                    </DataTableCell>
                  </DataTableRow>
                ))}
              </DataTableBody>
            </DataTable>
          )}
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <h2 className="text-[16px] font-semibold text-text-primary">{info.guideTitle}</h2>
        <p className="mt-1 text-[13px] text-text-secondary">{info.guideDesc}</p>

        <div className="mt-4">
          <h3 className="text-[14px] font-medium text-text-primary">{info.formulaTitle}</h3>
          <ul className="mt-2 space-y-1 rounded-md bg-bg-subtle p-4 font-mono text-[12px] text-text-secondary">
            {info.formulaLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-[14px] font-medium text-text-primary">{info.ratingTitle}</h3>
          <div className="mt-3">
            <DataTable>
            <DataTableHead>
              <DataTableHeaderCell>{info.ratingHeaders.score}</DataTableHeaderCell>
              <DataTableHeaderCell>{info.ratingHeaders.rating}</DataTableHeaderCell>
              <DataTableHeaderCell>{info.ratingHeaders.reward}</DataTableHeaderCell>
            </DataTableHead>
            <DataTableBody>
              {info.ratings.map((row) => (
                <DataTableRow key={row.score}>
                  <DataTableCell>{row.score}</DataTableCell>
                  <DataTableCell>{row.rating}</DataTableCell>
                  <DataTableCell className="font-medium">{row.reward}</DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
            </DataTable>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-[14px] font-medium text-text-primary">{info.periodRulesTitle}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-text-secondary">
            {info.periodRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      </SurfaceCard>
    </div>
  );
}
