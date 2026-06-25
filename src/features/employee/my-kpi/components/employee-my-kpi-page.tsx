"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { employeePortalService } from "@/features/employee/services/employeePortalService";
import { PageHeader } from "@/components/cms/page-header";
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
import { formatBonusRate, getRatingColorClass } from "@/lib/formatters/kpi";
import { useTranslation } from "@/providers/preferences-provider";
import type { KpiPeriod, KpiResult, PaginatedMeta } from "@/types/api";

export function EmployeeMyKpiPage() {
  const { user } = useAuth();
  const { dict } = useTranslation();
  const my = dict.employee.myKpi;
  const [results, setResults] = useState<KpiResult[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [periods, setPeriods] = useState<KpiPeriod[]>([]);
  const [periodId, setPeriodId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    employeePortalService
      .getPeriods({ limit: 100, sortOrder: "desc" })
      .then((res) => setPeriods(res.data))
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
      } catch (err) {
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

      <DataTable
        footer={meta.total > 0 ? <PaginationBar meta={meta} onPageChange={load} /> : undefined}
        empty={
          !loading && results.length === 0 ? <EmptyState description={my.empty} /> : undefined
        }
      >
        {loading ? (
          <tbody>
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-[13px] text-text-muted">
                {dict.common.loading}
              </td>
            </tr>
          </tbody>
        ) : results.length > 0 ? (
          <>
            <DataTableHead>
              <DataTableHeaderCell>{dict.kpiEvents.period}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiResults.finalScore}</DataTableHeaderCell>
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
