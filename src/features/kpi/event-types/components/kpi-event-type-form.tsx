"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { kpiEventTypesService } from "@/features/kpi/event-types/services/kpiEventTypesService";
import { FormSection } from "@/components/cms/form-section";
import { StickyActionBar } from "@/components/cms/sticky-action-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { useTranslation } from "@/providers/preferences-provider";
import type { KpiEventKind, KpiEventType } from "@/types/api";

interface KpiEventTypeFormProps {
  eventType?: KpiEventType;
}

export function KpiEventTypeForm({ eventType }: KpiEventTypeFormProps) {
  const router = useRouter();
  const { dict } = useTranslation();
  const isEditing = Boolean(eventType);
  const isDeleted = Boolean(eventType?.deletedAt);

  const [code, setCode] = useState(eventType?.code ?? "");
  const [name, setName] = useState(eventType?.name ?? "");
  const [description, setDescription] = useState(eventType?.description ?? "");
  const [eventKind, setEventKind] = useState<KpiEventKind>(eventType?.eventKind ?? "BONUS");
  const [defaultPoints, setDefaultPoints] = useState(String(eventType?.defaultPoints ?? 1));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      code,
      name,
      description: description || undefined,
      eventKind,
      defaultPoints: Number(defaultPoints),
    };

    try {
      if (isEditing) {
        await kpiEventTypesService.update(eventType!.id, payload);
      } else {
        await kpiEventTypesService.create(payload);
      }
      router.push("/admin/kpi-event-types");
    } catch (err) {
      setError(getApiErrorMessage(err, dict.errors));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {isDeleted && (
        <div className="mb-4 rounded-md border border-warning/30 bg-warning-subtle px-4 py-3 text-[13px] text-warning">
          {dict.kpiEventTypes.deletedReadOnly}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md border border-danger/30 bg-danger-subtle px-4 py-3 text-[13px] text-danger">
          {error}
        </div>
      )}

      <FormSection title={dict.kpiEventTypes.sectionTitle}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={dict.kpiEventTypes.fieldCode}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            disabled={isDeleted}
          />
          <Input
            label={dict.common.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isDeleted}
          />
          <Select
            label={dict.kpiEventTypes.fieldKind}
            name="eventKind"
            value={eventKind}
            onChange={(e) => setEventKind(e.target.value as KpiEventKind)}
            disabled={isDeleted}
            options={[
              { value: "BONUS", label: dict.kpiEventTypes.bonusOption },
              { value: "PENALTY", label: dict.kpiEventTypes.penaltyOption },
            ]}
          />
          <Input
            label={dict.kpiEventTypes.defaultPoints}
            type="number"
            value={defaultPoints}
            onChange={(e) => setDefaultPoints(e.target.value)}
            helperText={dict.kpiEventTypes.pointsHelper}
            disabled={isDeleted}
          />
        </div>
        <Textarea
          label={dict.common.description}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          disabled={isDeleted}
        />
      </FormSection>

      <StickyActionBar>
        <Link href="/admin/kpi-event-types">
          <Button variant="secondary" type="button">
            {dict.common.cancel}
          </Button>
        </Link>
        <Button type="submit" disabled={loading || isDeleted}>
          {loading
            ? dict.common.saving
            : isEditing
              ? dict.common.save
              : dict.kpiEventTypes.createSubmit}
        </Button>
      </StickyActionBar>
    </form>
  );
}
