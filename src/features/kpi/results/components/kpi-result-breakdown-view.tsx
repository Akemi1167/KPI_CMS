"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { employeePortalService } from "@/features/employee/services/employeePortalService";
import { kpiResultsService } from "@/features/kpi/results/services/kpiResultsService";
import { PageHeader } from "@/components/cms/page-header";
import { SurfaceCard } from "@/components/cms/surface-card";
import { EmptyState } from "@/components/cms/empty-state";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/cms/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/layout/page-loading";
import { formatDate } from "@/i18n";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { formatBonusRate, formatKpiPoint, getRatingColorClass } from "@/lib/formatters/kpi";
import { useTranslation } from "@/providers/preferences-provider";
import type { KpiEvent, KpiResultBreakdown } from "@/types/api";

type BreakdownTab = "bonus" | "penalty" | "stats" | "timeline";

interface KpiResultBreakdownViewProps {
  resultId?: string;
  userId?: string;
  periodId?: string;
  backHref?: string;
  forbiddenMessage?: string;
  currentUserId?: string;
  /** Use employee BFF routes (read-only, scoped to logged-in employee). */
  employeeMode?: boolean;
}

function EventList({ events, empty }: { events: KpiEvent[]; empty: string }) {
  const { dict, locale } = useTranslation();

  if (events.length === 0) {
    return <EmptyState description={empty} />;
  }

  return (
    <DataTable>
      <DataTableHead>
        <DataTableHeaderCell>{dict.kpiEventTypes.fieldKind}</DataTableHeaderCell>
        <DataTableHeaderCell>{dict.common.name}</DataTableHeaderCell>
        <DataTableHeaderCell>{dict.kpiEvents.points}</DataTableHeaderCell>
        <DataTableHeaderCell>{dict.kpiEvents.quantity}</DataTableHeaderCell>
        <DataTableHeaderCell>{dict.kpiEvents.total}</DataTableHeaderCell>
        <DataTableHeaderCell>{dict.kpiEvents.occurredAt}</DataTableHeaderCell>
      </DataTableHead>
      <DataTableBody>
        {events.map((event) => (
          <DataTableRow key={event.id}>
            <DataTableCell>
              <Badge variant={event.eventKind === "BONUS" ? "success" : "danger"}>
                {event.eventKind}
              </Badge>
            </DataTableCell>
            <DataTableCell>{event.eventTypeSnapshot?.name ?? event.eventTypeId}</DataTableCell>
            <DataTableCell>{formatKpiPoint(event.points)}</DataTableCell>
            <DataTableCell>{event.quantity}</DataTableCell>
            <DataTableCell className="font-medium">{formatKpiPoint(event.totalPoints)}</DataTableCell>
            <DataTableCell className="text-text-muted">
              {formatDate(event.occurredAt, locale)}
            </DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  );
}

export function KpiResultBreakdownView({
  resultId,
  userId,
  periodId,
  backHref = "/admin/kpi-results",
  forbiddenMessage,
  currentUserId,
  employeeMode = false,
}: KpiResultBreakdownViewProps) {
  const { dict, locale } = useTranslation();
  const b = dict.kpiResults.breakdown;
  const [data, setData] = useState<KpiResultBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<BreakdownTab>("bonus");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = resultId
        ? employeeMode
          ? await employeePortalService.getBreakdownById(resultId)
          : await kpiResultsService.getBreakdownById(resultId)
        : userId && periodId
          ? await kpiResultsService.getBreakdown(userId, periodId)
          : null;

      if (!res) {
        setError(dict.errors.generic);
        setData(null);
        return;
      }
      if (currentUserId && res.data.user.id !== currentUserId) {
        setError(forbiddenMessage ?? dict.errors.generic);
        setData(null);
        return;
      }
      setData(res.data);
    } catch (err) {
      setError(getApiErrorMessage(err, dict.errors));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [resultId, userId, periodId, dict.errors, currentUserId, forbiddenMessage, employeeMode]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <PageLoading />;
  if (error || !data) {
    return (
      <div>
        <Link href={backHref}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft size={14} />
            {b.back}
          </Button>
        </Link>
        <div className="rounded-md border border-danger/30 bg-danger-subtle px-4 py-3 text-[13px] text-danger">
          {error || dict.errors.generic}
        </div>
      </div>
    );
  }

  const { user, period, result, summary } = data;
  const tabs: { id: BreakdownTab; label: string }[] = [
    { id: "bonus", label: b.tabBonus },
    { id: "penalty", label: b.tabPenalty },
    { id: "stats", label: b.tabStats },
    { id: "timeline", label: b.tabTimeline },
  ];

  return (
    <div>
      <Link href={backHref}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft size={14} />
          {b.back}
        </Button>
      </Link>

      <PageHeader
        title={resultId ? b.title : b.previewTitle}
        description={`${user.fullName} (${user.employeeCode}) — ${period.name}`}
        action={
          <span className={`rounded-full px-3 py-1 text-[13px] font-medium ${getRatingColorClass(summary.rating)}`}>
            {summary.rating}
          </span>
        }
      />

      {!result && (
        <p className="mb-4 text-[13px] text-text-secondary">{b.notCalculated}</p>
      )}

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <SurfaceCard className="p-4">
          <p className="text-[12px] text-text-muted">{dict.kpiPeriods.baseScore}</p>
          <p className="mt-1 text-[20px] font-semibold text-text-primary">{summary.baseScore}</p>
        </SurfaceCard>
        <SurfaceCard className="p-4">
          <p className="text-[12px] text-text-muted">{b.rawBonus}</p>
          <p className="mt-1 text-[20px] font-semibold text-success">
            {formatKpiPoint(summary.rawBonusPoints)}
          </p>
        </SurfaceCard>
        <SurfaceCard className="p-4">
          <p className="text-[12px] text-text-muted">{b.bonus}</p>
          <p className="mt-1 text-[20px] font-semibold text-success">
            {formatKpiPoint(summary.bonusPoints)}
          </p>
        </SurfaceCard>
        <SurfaceCard className="p-4">
          <p className="text-[12px] text-text-muted">{b.penalty}</p>
          <p className="mt-1 text-[20px] font-semibold text-danger">
            {formatKpiPoint(summary.penaltyPoints)}
          </p>
        </SurfaceCard>
        <SurfaceCard className="p-4">
          <p className="text-[12px] text-text-muted">{dict.kpiResults.finalScore}</p>
          <p className="mt-1 text-[20px] font-semibold text-text-primary">{summary.finalScore}</p>
          <p className="mt-1 text-[12px] text-text-secondary">
            {dict.kpiResults.reward}: {formatBonusRate(summary.rewardPercent)}
          </p>
        </SurfaceCard>
      </div>

      <div className="mb-4 flex flex-wrap gap-1 border-b border-border-default">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`border-b-2 px-4 py-2 text-[13px] font-medium transition-colors ${
              tab === item.id
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "bonus" && <EventList events={data.bonusEvents} empty={b.emptyBonus} />}
      {tab === "penalty" && <EventList events={data.penaltyEvents} empty={b.emptyPenalty} />}

      {tab === "stats" &&
        (data.statisticsByEventType.length === 0 ? (
          <EmptyState description={b.emptyStats} />
        ) : (
          <DataTable>
            <DataTableHead>
              <DataTableHeaderCell>{b.eventType}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.common.code}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiEventTypes.fieldKind}</DataTableHeaderCell>
              <DataTableHeaderCell>{b.eventCount}</DataTableHeaderCell>
              <DataTableHeaderCell align="right">{dict.kpiEvents.total}</DataTableHeaderCell>
            </DataTableHead>
            <DataTableBody>
              {data.statisticsByEventType.map((stat) => (
                <DataTableRow key={stat.eventTypeId}>
                  <DataTableCell>{stat.name}</DataTableCell>
                  <DataTableCell className="text-text-secondary">{stat.code}</DataTableCell>
                  <DataTableCell>
                    <Badge variant={stat.eventKind === "BONUS" ? "success" : "danger"}>
                      {stat.eventKind}
                    </Badge>
                  </DataTableCell>
                  <DataTableCell>{stat.count}</DataTableCell>
                  <DataTableCell align="right" className="font-medium">
                    {formatKpiPoint(stat.totalPoints)}
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>
        ))}

      {tab === "timeline" &&
        (data.timeline.length === 0 ? (
          <EmptyState description={b.emptyTimeline} />
        ) : (
          <DataTable>
            <DataTableHead>
              <DataTableHeaderCell>{dict.kpiEvents.occurredAt}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.common.name}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiEvents.points}</DataTableHeaderCell>
              <DataTableHeaderCell>{dict.kpiEvents.total}</DataTableHeaderCell>
              <DataTableHeaderCell align="right">{b.runningScore}</DataTableHeaderCell>
            </DataTableHead>
            <DataTableBody>
              {data.timeline.map((entry) => (
                <DataTableRow key={entry.id}>
                  <DataTableCell className="text-text-muted">
                    {formatDate(entry.occurredAt, locale)}
                  </DataTableCell>
                  <DataTableCell>{entry.eventTypeSnapshot?.name ?? entry.id}</DataTableCell>
                  <DataTableCell>
                    <Badge variant={entry.eventKind === "BONUS" ? "success" : "danger"}>
                      {formatKpiPoint(entry.points)}
                    </Badge>
                  </DataTableCell>
                  <DataTableCell>{formatKpiPoint(entry.totalPoints)}</DataTableCell>
                  <DataTableCell align="right" className="font-medium">
                    {entry.runningFinalScore}
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>
        ))}
    </div>
  );
}
