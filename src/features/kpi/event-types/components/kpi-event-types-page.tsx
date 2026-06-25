"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Ban } from "lucide-react";
import { kpiEventTypesService } from "@/features/kpi/event-types/services/kpiEventTypesService";
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
import { formatKpiPoint } from "@/lib/formatters/kpi";
import { useTranslation } from "@/providers/preferences-provider";
import type { KpiEventKind, KpiEventType, PaginatedMeta } from "@/types/api";

export function KpiEventTypesPage() {
  const { dict } = useTranslation();
  const [items, setItems] = useState<KpiEventType[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [eventKind, setEventKind] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deactivateTarget, setDeactivateTarget] = useState<KpiEventType | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError("");
      try {
        const res = await kpiEventTypesService.findAll({
          page,
          limit: 20,
          eventKind: (eventKind as KpiEventKind) || undefined,
        });
        setItems(res.data);
        setMeta(res.meta);
      } catch (err) {
        setError(getApiErrorMessage(err, dict.errors));
      } finally {
        setLoading(false);
      }
    },
    [eventKind, dict.errors],
  );

  useEffect(() => {
    load(1);
  }, [load]);

  async function handleDeactivate() {
    if (!deactivateTarget) return;
    setActionLoading(true);
    try {
      await kpiEventTypesService.deactivate(deactivateTarget.id);
      setDeactivateTarget(null);
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
        title={dict.kpiEventTypes.title}
        description={dict.kpiEventTypes.description}
        action={
          <Link href="/admin/kpi-event-types/new">
            <Button>
              <Plus size={16} />
              {dict.kpiEventTypes.create}
            </Button>
          </Link>
        }
      />

      <div className="mb-4 w-48">
        <Select
          name="eventKind"
          value={eventKind}
          onChange={(e) => setEventKind(e.target.value)}
          options={[
            { value: "", label: dict.kpiEventTypes.allKinds },
            { value: "BONUS", label: "BONUS" },
            { value: "PENALTY", label: "PENALTY" },
          ]}
        />
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-danger/30 bg-danger-subtle px-4 py-3 text-[13px] text-danger">
          {error}
        </div>
      )}

      <DataTable
        footer={meta.total > 0 ? <PaginationBar meta={meta} onPageChange={load} /> : undefined}
        empty={
          !loading && items.length === 0 ? (
            <EmptyState description={dict.kpiEventTypes.empty} />
          ) : undefined
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
        ) : items.length > 0 ? (
          <>
            <DataTableHead>
              <DataTableHeaderCell>{dict.common.code}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.common.name}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiEventTypes.fieldKind}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiEventTypes.defaultPoints}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.common.status}</DataTableHeaderCell>
              <DataTableHeaderCell align="right">{dict.common.actions}</DataTableHeaderCell>
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
                  <DataTableCell>
                    <Badge variant={item.isActive ? "success" : "inactive"}>
                      {item.isActive ? dict.common.active : dict.common.inactive}
                    </Badge>
                  </DataTableCell>
                  <DataTableCell align="right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/kpi-event-types/${item.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Pencil size={14} />
                          {dict.common.edit}
                        </Button>
                      </Link>
                      {item.isActive && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-danger"
                          onClick={() => setDeactivateTarget(item)}
                          type="button"
                        >
                          <Ban size={14} />
                          {dict.kpiEventTypes.deactivate}
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
        open={Boolean(deactivateTarget)}
        title={dict.kpiEventTypes.deactivateTitle}
        description={dict.kpiEventTypes.deactivateConfirm}
        confirmLabel={dict.common.confirm}
        cancelLabel={dict.common.cancel}
        variant="danger"
        loading={actionLoading}
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivateTarget(null)}
      />
    </div>
  );
}
