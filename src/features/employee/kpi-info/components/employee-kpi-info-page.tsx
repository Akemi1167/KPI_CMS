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
import type { PublicKpiEventType } from "@/types/api";

type EventKindTab = "BONUS" | "PENALTY";

function EventTypeTable({ items, empty }: { items: PublicKpiEventType[]; empty: string }) {
  const { dict } = useTranslation();
  const info = dict.employee.kpiInfo;

  if (items.length === 0) {
    return <EmptyState description={empty} />;
  }

  return (
    <DataTable>
      <DataTableHead>
        <DataTableHeaderCell>{dict.common.code}</DataTableHeaderCell>
        <DataTableHeaderCell>{dict.common.name}</DataTableHeaderCell>
        <DataTableHeaderCell>{info.fieldExplanation}</DataTableHeaderCell>
        <DataTableHeaderCell>{dict.kpiEventTypes.defaultPoints}</DataTableHeaderCell>
      </DataTableHead>
      <DataTableBody>
        {items.map((item) => (
          <DataTableRow key={item.id}>
            <DataTableCell className="font-medium">{item.code}</DataTableCell>
            <DataTableCell>{item.name}</DataTableCell>
            <DataTableCell className="text-text-secondary">{item.explanation}</DataTableCell>
            <DataTableCell
              className={item.defaultPoints >= 0 ? "text-success" : "text-danger"}
            >
              {formatKpiPoint(item.defaultPoints)}
            </DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  );
}

export function EmployeeKpiInfoPage() {
  const { dict } = useTranslation();
  const info = dict.employee.kpiInfo;
  const [bonusItems, setBonusItems] = useState<PublicKpiEventType[]>([]);
  const [penaltyItems, setPenaltyItems] = useState<PublicKpiEventType[]>([]);
  const [tab, setTab] = useState<EventKindTab>("BONUS");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await employeePortalService.getEventTypes();
      setBonusItems(res.data.grouped.bonus);
      setPenaltyItems(res.data.grouped.penalty);
    } catch (err) {
      setError(getApiErrorMessage(err, dict.errors));
    } finally {
      setLoading(false);
    }
  }, [dict.errors]);

  useEffect(() => {
    load();
  }, [load]);

  const tabs: { id: EventKindTab; label: string }[] = [
    { id: "BONUS", label: dict.kpiResults.breakdown.tabBonus },
    { id: "PENALTY", label: dict.kpiResults.breakdown.tabPenalty },
  ];
  const activeItems = tab === "BONUS" ? bonusItems : penaltyItems;
  const emptyMessage =
    tab === "BONUS"
      ? dict.kpiResults.breakdown.emptyBonus
      : dict.kpiResults.breakdown.emptyPenalty;

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

        <div className="mt-4 flex flex-wrap gap-1 border-b border-border-default">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`px-3 py-2 text-[13px] font-medium transition-colors ${
                tab === item.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {item.label}
              <span className="ml-2">
                <Badge variant={item.id === "BONUS" ? "success" : "danger"}>
                  {item.id}
                </Badge>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4">
          {loading ? (
            <p className="text-[13px] text-text-muted">{dict.common.loading}</p>
          ) : (
            <EventTypeTable items={activeItems} empty={emptyMessage} />
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
