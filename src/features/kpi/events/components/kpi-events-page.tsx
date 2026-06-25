"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { kpiEventsService } from "@/features/kpi/events/services/kpiEventsService";
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
import { formatDate } from "@/i18n";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { formatKpiPoint } from "@/lib/formatters/kpi";
import { useTranslation } from "@/providers/preferences-provider";
import type { KpiEvent, KpiPeriod, PaginatedMeta, User } from "@/types/api";

export function KpiEventsPage() {
  const { dict, locale } = useTranslation();
  const [events, setEvents] = useState<KpiEvent[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [periodId, setPeriodId] = useState("");
  const [userId, setUserId] = useState("");
  const [eventKind, setEventKind] = useState("");
  const [periods, setPeriods] = useState<KpiPeriod[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<KpiEvent | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

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
        const res = await kpiEventsService.findAll({
          page,
          limit: 20,
          periodId: periodId || undefined,
          userId: userId || undefined,
          eventKind: (eventKind as "BONUS" | "PENALTY") || undefined,
        });
        setEvents(res.data);
        setMeta(res.meta);
      } catch (err) {
        setError(getApiErrorMessage(err, dict.errors));
      } finally {
        setLoading(false);
      }
    },
    [periodId, userId, eventKind, dict.errors],
  );

  useEffect(() => {
    load(1);
  }, [load]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await kpiEventsService.remove(deleteTarget.id);
      setDeleteTarget(null);
      await load(meta.page);
    } catch (err) {
      setError(getApiErrorMessage(err, dict.errors));
    } finally {
      setActionLoading(false);
    }
  }

  const periodMap = Object.fromEntries(periods.map((p) => [p.id, p.code]));
  const userMap = Object.fromEntries(users.map((u) => [u.id, u.fullName]));

  return (
    <div>
      <PageHeader
        title={dict.kpiEvents.title}
        description={dict.kpiEvents.description}
        action={
          <Link href="/admin/kpi-events/new">
            <Button>
              <Plus size={16} />
              {dict.kpiEvents.create}
            </Button>
          </Link>
        }
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
        <div className="w-40">
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
          !loading && events.length === 0 ? (
            <EmptyState description={dict.kpiEvents.empty} />
          ) : undefined
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
        ) : events.length > 0 ? (
          <>
            <DataTableHead>
              <DataTableHeaderCell>{dict.kpiEvents.period}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiEvents.employee}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiEvents.kind}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiEvents.points}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiEvents.total}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiEvents.occurredAt}</DataTableHeaderCell>
              <DataTableHeaderCell align="right">{dict.common.actions}</DataTableHeaderCell>
            </DataTableHead>
            <DataTableBody>
              {events.map((event) => (
                <DataTableRow key={event.id}>
                  <DataTableCell>{periodMap[event.periodId] ?? event.periodId}</DataTableCell>
                  <DataTableCell>{userMap[event.userId] ?? event.userId}</DataTableCell>
                  <DataTableCell>
                    <Badge variant={event.eventKind === "BONUS" ? "success" : "danger"}>
                      {event.eventTypeSnapshot?.name ?? event.eventKind}
                    </Badge>
                  </DataTableCell>
                  <DataTableCell>{formatKpiPoint(event.points)}</DataTableCell>
                  <DataTableCell className="font-medium">
                    {formatKpiPoint(event.totalPoints)}
                  </DataTableCell>
                  <DataTableCell className="text-text-muted">
                    {formatDate(event.occurredAt, locale)}
                  </DataTableCell>
                  <DataTableCell align="right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-danger"
                      onClick={() => setDeleteTarget(event)}
                      type="button"
                    >
                      <Trash2 size={14} />
                      {dict.common.delete}
                    </Button>
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </>
        ) : null}
      </DataTable>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={dict.kpiEvents.deleteTitle}
        description={dict.kpiEvents.deleteConfirm}
        confirmLabel={dict.common.delete}
        cancelLabel={dict.common.cancel}
        variant="danger"
        loading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
