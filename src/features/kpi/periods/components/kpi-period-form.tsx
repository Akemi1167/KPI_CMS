"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { kpiPeriodsService } from "@/features/kpi/periods/services/kpiPeriodsService";
import { FormSection } from "@/components/cms/form-section";
import { StickyActionBar } from "@/components/cms/sticky-action-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { useTranslation } from "@/providers/preferences-provider";
import type { KpiPeriod } from "@/types/api";

interface KpiPeriodFormProps {
  period?: KpiPeriod;
}

export function KpiPeriodForm({ period }: KpiPeriodFormProps) {
  const router = useRouter();
  const { dict } = useTranslation();
  const isEditing = Boolean(period);

  const [name, setName] = useState(period?.name ?? "");
  const [startDate, setStartDate] = useState(period?.startDate?.slice(0, 10) ?? "");
  const [endDate, setEndDate] = useState(period?.endDate?.slice(0, 10) ?? "");
  const [baseScore, setBaseScore] = useState(String(period?.baseScore ?? 100));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name,
      startDate,
      endDate,
      baseScore: Number(baseScore),
    };

    try {
      if (isEditing) {
        await kpiPeriodsService.update(period!.id, payload);
      } else {
        await kpiPeriodsService.create(payload);
      }
      router.push("/admin/kpi-periods");
    } catch (err) {
      setError(getApiErrorMessage(err, dict.errors));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {error && (
        <div className="mb-4 rounded-md border border-danger/30 bg-danger-subtle px-4 py-3 text-[13px] text-danger">
          {error}
        </div>
      )}

      <FormSection title={dict.kpiPeriods.sectionTitle}>
        <Input
          label={dict.kpiPeriods.fieldName}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={dict.kpiPeriods.fieldStartDate}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            label={dict.kpiPeriods.fieldEndDate}
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          <Input
            label={dict.kpiPeriods.baseScore}
            type="number"
            value={baseScore}
            onChange={(e) => setBaseScore(e.target.value)}
          />
        </div>
      </FormSection>

      <StickyActionBar>
        <Link href="/admin/kpi-periods">
          <Button variant="secondary" type="button">
            {dict.common.cancel}
          </Button>
        </Link>
        <Button type="submit" disabled={loading}>
          {loading
            ? dict.common.saving
            : isEditing
              ? dict.common.save
              : dict.kpiPeriods.createSubmit}
        </Button>
      </StickyActionBar>
    </form>
  );
}
