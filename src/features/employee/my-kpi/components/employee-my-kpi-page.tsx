"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { employeePortalService } from "@/features/employee/services/employeePortalService";
import { PageHeader } from "@/components/cms/page-header";
import { SurfaceCard } from "@/components/cms/surface-card";
import { PaginationBar } from "@/components/common/pagination-bar";
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
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { formatDate } from "@/i18n";
import { formatBonusRate, formatKpiPoint, getRatingColorClass } from "@/lib/formatters/kpi";
import { useTranslation } from "@/providers/preferences-provider";
import type { KpiPeriod, KpiResult, KpiResultBreakdown, PaginatedMeta } from "@/types/api";

export function EmployeeMyKpiPage() {
  const { user } = useAuth();
  const { dict, locale } = useTranslation();
  const my = dict.employee.myKpi;
  const breakdownLabels = dict.kpiResults.breakdown;
  const [results, setResults] = useState<KpiResult[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [periods, setPeriods] = useState<KpiPeriod[]>([]);
  const [periodId, setPeriodId] = useState("");
  const [breakdown, setBreakdown] = useState<KpiResultBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    employeePortalService
      .getPeriods({ limit: 100, sortOrder: "desc" })
      .then((res) => {
        setPeriods(res.data);
        setPeriodId((current) => current || res.data[0]?.id || "");
      })
      .catch(() => {});
  }, []);

  const load = useCallback(
    async (page = 1) => {
      if (!user) return;
      setLoading(true);
      setError("");
      try {
        const res = await employeePortalService.getMyResults({
          page,
          limit: 20,
          periodId: periodId || undefined,
        });
        setResults(res.data);
        setMeta(res.meta);
        if (periodId) {
          const detail = await employeePortalService.getBreakdown(periodId);
          setBreakdown(detail.data);
        } else {
          setBreakdown(null);
        }
      } catch (err) {
        setBreakdown(null);
        setError(getApiErrorMessage(err, dict.errors));
      } finally {
        setLoading(false);
      }
    },
    [user, periodId, dict.errors],
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const periodMap = Object.fromEntries(periods.map((p) => [p.id, p]));

  return (
    <div>
      <PageHeader title={my.title} description={my.description} />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="w-48">
          <Select
            label={dict.kpiEvents.period}
            name="periodId"
            value={periodId}
            onChange={(e) => setPeriodId(e.target.value)}
            options={[
              { value: "", label: my.allPeriods },
              ...periods.map((p) => ({ value: p.id, label: p.code })),
            ]}
          />
        </div>
        <div className="flex items-end">
          <Button variant="secondary" onClick={() => load(1)} type="button">
            {dict.common.filter}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-danger/30 bg-danger-subtle px-4 py-3 text-[13px] text-danger">
          {error}
        </div>
      )}

      {breakdown && (
        <div className="mb-6 space-y-4">
          <div>
            <h2 className="text-[16px] font-semibold text-text-primary">{breakdown.period.name}</h2>
            {!breakdown.result && (
              <p className="mt-1 text-[13px] text-text-secondary">{breakdownLabels.notCalculated}</p>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SurfaceCard className="p-4">
              <p className="text-[12px] text-text-muted">{dict.kpiResults.finalScore}</p>
              <p className="mt-1 text-[20px] font-semibold text-text-primary">
                {breakdown.summary.finalScore}
              </p>
            </SurfaceCard>
            <SurfaceCard className="p-4">
              <p className="text-[12px] text-text-muted">{breakdownLabels.penalty}</p>
              <p className="mt-1 text-[20px] font-semibold text-danger">
                {formatKpiPoint(breakdown.summary.penaltyPoints)}
              </p>
            </SurfaceCard>
            <SurfaceCard className="p-4">
              <p className="text-[12px] text-text-muted">{dict.kpiResults.rating}</p>
              <p className={`mt-1 text-[20px] font-semibold ${getRatingColorClass(breakdown.summary.rating)}`}>
                {breakdown.summary.rating}
              </p>
            </SurfaceCard>
            <SurfaceCard className="p-4">
              <p className="text-[12px] text-text-muted">{dict.kpiResults.reward}</p>
              <p className="mt-1 text-[20px] font-semibold text-text-primary">
                {formatBonusRate(breakdown.summary.rewardPercent)}
              </p>
            </SurfaceCard>
          </div>

          <div>
            <h2 className="mb-3 text-[16px] font-semibold text-text-primary">{my.penaltyTitle}</h2>
            {breakdown.bonusEvents.length + breakdown.penaltyEvents.length === 0 ? (
              <EmptyState description={dict.kpiEvents.empty} />
            ) : (
              <DataTable>
                <DataTableHead>
                  <DataTableHeaderCell>{dict.kpiEvents.kind}</DataTableHeaderCell>
                  <DataTableHeaderCell>{dict.common.name}</DataTableHeaderCell>
                  <DataTableHeaderCell>{dict.kpiEvents.points}</DataTableHeaderCell>
                  <DataTableHeaderCell>{dict.kpiEvents.occurredAt}</DataTableHeaderCell>
                  <DataTableHeaderCell>{dict.kpiEvents.note}</DataTableHeaderCell>
                </DataTableHead>
                <DataTableBody>
                  {[...breakdown.bonusEvents, ...breakdown.penaltyEvents]
                    .sort(
                      (a, b) =>
                        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
                    )
                    .map((event) => (
                      <DataTableRow key={event.id}>
                        <DataTableCell>
                          <Badge variant={event.eventKind === "BONUS" ? "success" : "danger"}>
                            {event.eventKind === "BONUS"
                              ? breakdownLabels.tabBonus
                              : breakdownLabels.tabPenalty}
                          </Badge>
                        </DataTableCell>
                        <DataTableCell>
                          {event.eventTypeSnapshot?.name ?? event.eventTypeId}
                        </DataTableCell>
                        <DataTableCell
                          className={`font-medium ${event.eventKind === "BONUS" ? "text-success" : "text-danger"}`}
                        >
                          {formatKpiPoint(event.totalPoints)}
                        </DataTableCell>
                        <DataTableCell className="text-text-muted">
                          {formatDate(event.occurredAt, locale)}
                        </DataTableCell>
                        <DataTableCell className="max-w-[360px] whitespace-pre-wrap text-text-secondary">
                          {event.note?.trim() || "—"}
                        </DataTableCell>
                      </DataTableRow>
                    ))}
                </DataTableBody>
              </DataTable>
            )}
          </div>
        </div>
      )}

      <DataTable
        footer={meta.total > 0 ? <PaginationBar meta={meta} onPageChange={load} /> : undefined}
        empty={
          !loading && results.length === 0 ? <EmptyState description={my.empty} /> : undefined
        }
      >
        {loading ? (
          <tbody>
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-[13px] text-text-muted">
                {dict.common.loading}
              </td>
            </tr>
          </tbody>
        ) : results.length > 0 ? (
          <>
            <DataTableHead>
              <DataTableHeaderCell>{dict.kpiEvents.period}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiResults.finalScore}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiResults.breakdown.penalty}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiResults.rating}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiResults.reward}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiResults.approve}</DataTableHeaderCell>
              <DataTableHeaderCell align="right">{dict.common.actions}</DataTableHeaderCell>
            </DataTableHead>
            <DataTableBody>
              {results.map((result) => (
                <DataTableRow key={result.id}>
                  <DataTableCell>{periodMap[result.periodId]?.code ?? result.periodId}</DataTableCell>
                  <DataTableCell className="font-medium">{result.finalScore}</DataTableCell>
                  <DataTableCell className="text-danger">
                    {formatKpiPoint(result.penaltyPoints)}
                  </DataTableCell>
                  <DataTableCell>
                    <span className={getRatingColorClass(result.rating)}>{result.rating}</span>
                  </DataTableCell>
                  <DataTableCell>{formatBonusRate(result.rewardPercent)}</DataTableCell>
                  <DataTableCell>
                    <Badge variant={result.isApproved ? "success" : "inactive"}>
                      {result.isApproved ? dict.kpiResults.approved : dict.kpiResults.notApproved}
                    </Badge>
                  </DataTableCell>
                  <DataTableCell align="right">
                    <Link href={`/employee/my-kpi/${result.id}/breakdown`}>
                      <Button variant="ghost" size="sm" type="button">
                        <Eye size={14} />
                        {my.viewDetail}
                      </Button>
                    </Link>
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </>
        ) : null}
      </DataTable>
    </div>
  );
}
