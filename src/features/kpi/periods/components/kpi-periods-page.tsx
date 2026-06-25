"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { kpiPeriodsService } from "@/features/kpi/periods/services/kpiPeriodsService";
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
import { formatDate } from "@/i18n";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { formatPeriodLabel, getPeriodStatusVariant } from "@/lib/formatters/kpi";
import { useTranslation } from "@/providers/preferences-provider";
import type { KpiPeriod, PaginatedMeta } from "@/types/api";

export function KpiPeriodsPage() {
  const { dict, locale, t } = useTranslation();
  const [periods, setPeriods] = useState<KpiPeriod[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionTarget, setActionTarget] = useState<{ period: KpiPeriod; action: "close" | "lock" } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await kpiPeriodsService.findAll({ page, limit: 20, sortBy: "createdAt", sortOrder: "desc" });
      setPeriods(res.data);
      setMeta(res.meta);
    } catch (err) {
      setError(getApiErrorMessage(err, dict.errors));
    } finally {
      setLoading(false);
    }
  }, [dict.errors]);

  useEffect(() => {
    load(1);
  }, [load]);

  async function handleAction() {
    if (!actionTarget) return;
    setActionLoading(true);
    try {
      if (actionTarget.action === "close") {
        await kpiPeriodsService.close(actionTarget.period.id);
      } else {
        await kpiPeriodsService.lock(actionTarget.period.id);
      }
      setActionTarget(null);
      await load(meta.page);
    } catch (err) {
      setError(getApiErrorMessage(err, dict.errors));
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title={dict.kpiPeriods.title}
        description={dict.kpiPeriods.description}
        action={
          <Link href="/admin/kpi-periods/new">
            <Button>
              <Plus size={16} />
              {dict.kpiPeriods.create}
            </Button>
          </Link>
        }
      />

      {error && (
        <div className="mb-4 rounded-md border border-danger/30 bg-danger-subtle px-4 py-3 text-[13px] text-danger">
          {error}
        </div>
      )}

      <DataTable
        footer={meta.total > 0 ? <PaginationBar meta={meta} onPageChange={load} /> : undefined}
        empty={!loading && periods.length === 0 ? <EmptyState description={dict.kpiPeriods.empty} /> : undefined}
      >
        {loading ? (
          <tbody>
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-[13px] text-text-muted">
                {dict.common.loading}
              </td>
            </tr>
          </tbody>
        ) : periods.length > 0 ? (
          <>
            <DataTableHead>
              <DataTableHeaderCell>{dict.kpiPeriods.periodCode}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiPeriods.periodName}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiPeriods.dateRange}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiPeriods.baseScore}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.common.status}</DataTableHeaderCell>
              <DataTableHeaderCell align="right">{dict.common.actions}</DataTableHeaderCell>
            </DataTableHead>
            <DataTableBody>
              {periods.map((period) => (
                <DataTableRow key={period.id}>
                  <DataTableCell className="font-medium">{period.code}</DataTableCell>
                  <DataTableCell>{formatPeriodLabel(period.year, period.month)}</DataTableCell>
                  <DataTableCell className="text-text-secondary">
                    {formatDate(period.startDate, locale)} – {formatDate(period.endDate, locale)}
                  </DataTableCell>
                  <DataTableCell>{period.baseScore}</DataTableCell>
                  <DataTableCell>
                    <Badge variant={getPeriodStatusVariant(period.status)}>{period.status}</Badge>
                  </DataTableCell>
                  <DataTableCell align="right">
                    <div className="flex justify-end gap-1">
                      {period.status === "OPEN" && (
                        <Link href={`/admin/kpi-periods/${period.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Pencil size={14} />
                            {dict.common.edit}
                          </Button>
                        </Link>
                      )}
                      {period.status === "OPEN" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActionTarget({ period, action: "close" })}
                          type="button"
                        >
                          {dict.kpiPeriods.close}
                        </Button>
                      )}
                      {period.status !== "LOCKED" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-danger"
                          onClick={() => setActionTarget({ period, action: "lock" })}
                          type="button"
                        >
                          {dict.kpiPeriods.lock}
                        </Button>
                      )}
                    </div>
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </>
        ) : null}
      </DataTable>

      <ConfirmDialog
        open={Boolean(actionTarget)}
        title={
          actionTarget?.action === "close" ? dict.kpiPeriods.closeTitle : dict.kpiPeriods.lockTitle
        }
        description={
          actionTarget
            ? t(
                actionTarget.action === "close"
                  ? dict.kpiPeriods.closeConfirm
                  : dict.kpiPeriods.lockConfirm,
                { code: actionTarget.period.code },
              )
            : ""
        }
        confirmLabel={dict.common.confirm}
        cancelLabel={dict.common.cancel}
        variant={actionTarget?.action === "lock" ? "danger" : "default"}
        loading={actionLoading}
        onConfirm={handleAction}
        onCancel={() => setActionTarget(null)}
      />
    </div>
  );
}
