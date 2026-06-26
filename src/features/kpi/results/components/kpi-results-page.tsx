"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, FileSpreadsheet } from "lucide-react";
import { kpiResultsService } from "@/features/kpi/results/services/kpiResultsService";
import { kpiPeriodsService } from "@/features/kpi/periods/services/kpiPeriodsService";
import { usersService } from "@/features/users/services/usersService";
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
import { ConfirmDialog } from "@/components/cms/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { formatBonusRate, formatKpiPoint, getRatingColorClass } from "@/lib/formatters/kpi";
import { useTranslation } from "@/providers/preferences-provider";
import type { KpiPeriod, KpiResult, PaginatedMeta, User } from "@/types/api";

type ActionType = "calculate" | "calculatePeriod" | "approve" | "lock";

export function KpiResultsPage() {
  const { dict } = useTranslation();
  const [results, setResults] = useState<KpiResult[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [periodId, setPeriodId] = useState("");
  const [userId, setUserId] = useState("");
  const [periods, setPeriods] = useState<KpiPeriod[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [action, setAction] = useState<{
    type: ActionType;
    result?: KpiResult;
    periodId?: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      kpiPeriodsService.findAll({ limit: 100, sortOrder: "desc" }),
      usersService.findAll({ role: "EMPLOYEE", limit: 100 }),
    ])
      .then(([periodRes, userRes]) => {
        setPeriods(periodRes.data);
        setUsers(userRes.data);
      })
      .catch(() => {});
  }, []);

  const load = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError("");
      try {
        const res = await kpiResultsService.findAll({
          page,
          limit: 20,
          periodId: periodId || undefined,
          userId: userId || undefined,
        });
        setResults(res.data);
        setMeta(res.meta);
      } catch (err) {
        setError(getApiErrorMessage(err, dict.errors));
      } finally {
        setLoading(false);
      }
    },
    [periodId, userId, dict.errors],
  );

  useEffect(() => {
    load(1);
  }, [load]);

  async function handleExport() {
    if (!periodId) return;
    setExportLoading(true);
    setError("");
    try {
      await kpiResultsService.exportReport(periodId);
    } catch (err) {
      setError(getApiErrorMessage(err, dict.errors));
    } finally {
      setExportLoading(false);
    }
  }

  async function handleAction() {
    if (!action) return;
    setActionLoading(true);
    setError("");
    try {
      switch (action.type) {
        case "calculate":
          if (action.result) {
            await kpiResultsService.calculate({
              userId: action.result.userId,
              periodId: action.result.periodId,
            });
          }
          break;
        case "calculatePeriod":
          if (action.periodId) {
            await kpiResultsService.calculatePeriod(action.periodId);
          }
          break;
        case "approve":
          if (action.result) await kpiResultsService.approve(action.result.id);
          break;
        case "lock":
          if (action.result) await kpiResultsService.lock(action.result.id);
          break;
      }
      setAction(null);
      await load(meta.page);
    } catch (err) {
      setError(getApiErrorMessage(err, dict.errors));
    } finally {
      setActionLoading(false);
    }
  }

  const periodMap = Object.fromEntries(periods.map((p) => [p.id, p]));
  const userMap = Object.fromEntries(users.map((u) => [u.id, u.fullName]));

  const selectedPeriod = periodId ? periodMap[periodId] : null;

  const confirmTitle =
    action?.type === "calculate"
      ? dict.kpiResults.calculateTitle
      : action?.type === "calculatePeriod"
        ? dict.kpiResults.calculatePeriodTitle
        : action?.type === "approve"
          ? dict.kpiResults.approveTitle
          : dict.kpiResults.lockTitle;

  const confirmDescription =
    action?.type === "calculate"
      ? dict.kpiResults.calculateConfirm
      : action?.type === "calculatePeriod"
        ? dict.kpiResults.calculatePeriodConfirm
        : action?.type === "approve"
          ? dict.kpiResults.approveConfirm
          : dict.kpiResults.lockConfirm;

  return (
    <div>
      <PageHeader
        title={dict.kpiResults.title}
        description={dict.kpiResults.description}
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="w-48">
          <Select
            label={dict.kpiEvents.period}
            name="periodId"
            value={periodId}
            onChange={(e) => setPeriodId(e.target.value)}
            options={[
              { value: "", label: dict.kpiEvents.allPeriods },
              ...periods.map((p) => ({ value: p.id, label: p.code })),
            ]}
          />
        </div>
        <div className="w-48">
          <Select
            label={dict.kpiEvents.employee}
            name="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            options={[
              { value: "", label: dict.kpiEvents.allEmployees },
              ...users.map((u) => ({ value: u.id, label: u.fullName })),
            ]}
          />
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <Button
            variant="secondary"
            onClick={handleExport}
            disabled={!periodId || exportLoading}
            type="button"
            title={!periodId ? dict.kpiResults.exportExcelHint : undefined}
          >
            <FileSpreadsheet size={14} />
            {exportLoading ? dict.kpiResults.exportingExcel : dict.kpiResults.exportExcel}
          </Button>
          <Button
            onClick={() => periodId && setAction({ type: "calculatePeriod", periodId })}
            disabled={!periodId || selectedPeriod?.status === "LOCKED"}
            type="button"
          >
            {dict.kpiResults.batchCalculate}
          </Button>
          {userId && periodId && (
            <Link href={`/admin/kpi-results/preview?userId=${userId}&periodId=${periodId}`}>
              <Button variant="secondary" type="button">
                <Eye size={14} />
                {dict.kpiResults.preview}
              </Button>
            </Link>
          )}
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
          !loading && results.length === 0 ? (
            <EmptyState description={dict.kpiResults.empty} />
          ) : undefined
        }
      >
        {loading ? (
          <tbody>
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-[13px] text-text-muted">
                {dict.common.loading}
              </td>
            </tr>
          </tbody>
        ) : results.length > 0 ? (
          <>
            <DataTableHead>
              <DataTableHeaderCell>{dict.kpiEvents.employee}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiEvents.period}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiResults.finalScore}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiResults.rating}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiResults.reward}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiResults.approve}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiResults.lock}</DataTableHeaderCell>
              <DataTableHeaderCell align="right">{dict.common.actions}</DataTableHeaderCell>
            </DataTableHead>
            <DataTableBody>
              {results.map((result) => {
                const period = periodMap[result.periodId];
                const canCalculate = period?.status !== "LOCKED" && !result.isLocked;
                const canApprove =
                  !result.isApproved && !result.isLocked && period?.status !== "LOCKED";

                return (
                  <DataTableRow key={result.id}>
                    <DataTableCell>{userMap[result.userId] ?? result.userId}</DataTableCell>
                    <DataTableCell>{period?.code ?? result.periodId}</DataTableCell>
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
                    <DataTableCell>
                      <Badge variant={result.isLocked ? "danger" : "inactive"}>
                        {result.isLocked ? dict.common.locked : dict.common.open}
                      </Badge>
                    </DataTableCell>
                    <DataTableCell align="right">
                      <div className="flex justify-end gap-1">
                        <Link href={`/admin/kpi-results/${result.id}/breakdown`}>
                          <Button variant="ghost" size="sm" type="button">
                            <Eye size={14} />
                            {dict.kpiResults.viewDetail}
                          </Button>
                        </Link>
                        {canCalculate && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAction({ type: "calculate", result })}
                            type="button"
                          >
                            {dict.kpiResults.recalculate}
                          </Button>
                        )}
                        {canApprove && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAction({ type: "approve", result })}
                            type="button"
                          >
                            {dict.kpiResults.approve}
                          </Button>
                        )}
                        {!result.isLocked && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-danger"
                            onClick={() => setAction({ type: "lock", result })}
                            type="button"
                          >
                            {dict.kpiResults.lock}
                          </Button>
                        )}
                      </div>
                    </DataTableCell>
                  </DataTableRow>
                );
              })}
            </DataTableBody>
          </>
        ) : null}
      </DataTable>

      <div className="mt-4 rounded-md border border-border-default bg-bg-subtle p-4 text-[12px] text-text-secondary">
        <p>{dict.kpiResults.formulaNote}</p>
        <p className="mt-1">{dict.kpiResults.formula}</p>
      </div>

      <ConfirmDialog
        open={Boolean(action)}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={dict.common.confirm}
        cancelLabel={dict.common.cancel}
        variant={action?.type === "lock" ? "danger" : "default"}
        loading={actionLoading}
        onConfirm={handleAction}
        onCancel={() => setAction(null)}
      />
    </div>
  );
}
