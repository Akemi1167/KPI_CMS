"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Ban, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
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

type ActionType = "deactivate" | "softDelete" | "restore";

function isSoftDeleted(item: KpiEventType): boolean {
  return item.deletedAt != null;
}

export function KpiEventTypesPage() {
  const { dict } = useTranslation();
  const [items, setItems] = useState<KpiEventType[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [eventKind, setEventKind] = useState<string>("");
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [action, setAction] = useState<{ type: ActionType; item: KpiEventType } | null>(null);
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
          includeDeleted: includeDeleted || undefined,
        });
        setItems(res.data);
        setMeta(res.meta);
      } catch (err) {
        setError(getApiErrorMessage(err, dict.errors));
      } finally {
        setLoading(false);
      }
    },
    [eventKind, includeDeleted, dict.errors],
  );

  useEffect(() => {
    load(1);
  }, [load]);

  async function handleAction() {
    if (!action) return;
    setActionLoading(true);
    setError("");
    try {
      switch (action.type) {
        case "deactivate":
          await kpiEventTypesService.deactivate(action.item.id);
          break;
        case "softDelete":
          await kpiEventTypesService.softDelete(action.item.id);
          break;
        case "restore":
          await kpiEventTypesService.restore(action.item.id);
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

  const confirmTitle =
    action?.type === "deactivate"
      ? dict.kpiEventTypes.deactivateTitle
      : action?.type === "softDelete"
        ? dict.kpiEventTypes.softDeleteTitle
        : dict.kpiEventTypes.restoreTitle;

  const confirmDescription =
    action?.type === "deactivate"
      ? dict.kpiEventTypes.deactivateConfirm
      : action?.type === "softDelete"
        ? dict.kpiEventTypes.softDeleteConfirm
        : dict.kpiEventTypes.restoreConfirm;

  function renderStatusBadge(item: KpiEventType) {
    if (isSoftDeleted(item)) {
      return <Badge variant="danger">{dict.kpiEventTypes.statusDeleted}</Badge>;
    }
    if (!item.isActive) {
      return <Badge variant="inactive">{dict.kpiEventTypes.statusInactive}</Badge>;
    }
    return <Badge variant="success">{dict.common.active}</Badge>;
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

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="w-48">
          <Select
            label={dict.kpiEventTypes.fieldKind}
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
        <label className="flex items-center gap-2 pb-2 text-[13px] text-text-secondary">
          <input
            type="checkbox"
            checked={includeDeleted}
            onChange={(e) => setIncludeDeleted(e.target.checked)}
            className="rounded border-border-default"
          />
          {dict.kpiEventTypes.includeDeleted}
        </label>
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
                  <DataTableCell>{renderStatusBadge(item)}</DataTableCell>
                  <DataTableCell align="right">
                    <div className="flex justify-end gap-1">
                      {!isSoftDeleted(item) && (
                        <Link href={`/admin/kpi-event-types/${item.id}/edit`}>
                          <Button variant="ghost" size="sm" type="button">
                            <Pencil size={14} />
                            {dict.common.edit}
                          </Button>
                        </Link>
                      )}
                      {isSoftDeleted(item) ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAction({ type: "restore", item })}
                          type="button"
                        >
                          <RotateCcw size={14} />
                          {dict.kpiEventTypes.restore}
                        </Button>
                      ) : (
                        <>
                          {item.isActive && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setAction({ type: "deactivate", item })}
                              type="button"
                            >
                              <Ban size={14} />
                              {dict.kpiEventTypes.deactivate}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-danger"
                            onClick={() => setAction({ type: "softDelete", item })}
                            type="button"
                          >
                            <Trash2 size={14} />
                            {dict.kpiEventTypes.softDelete}
                          </Button>
                        </>
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
        open={Boolean(action)}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={dict.common.confirm}
        cancelLabel={dict.common.cancel}
        variant={action?.type === "restore" ? "default" : "danger"}
        loading={actionLoading}
        onConfirm={handleAction}
        onCancel={() => setAction(null)}
      />
    </div>
  );
}
