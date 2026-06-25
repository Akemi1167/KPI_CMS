"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { kpiEventsService } from "@/features/kpi/events/services/kpiEventsService";
import { kpiEventTypesService } from "@/features/kpi/event-types/services/kpiEventTypesService";
import { kpiPeriodsService } from "@/features/kpi/periods/services/kpiPeriodsService";
import { usersService } from "@/features/users/services/usersService";
import { FormSection } from "@/components/cms/form-section";
import { StickyActionBar } from "@/components/cms/sticky-action-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  createKpiEventSchema,
  type CreateKpiEventFormValues,
} from "@/lib/validators/kpi-events";
import { useTranslation } from "@/providers/preferences-provider";
import type { KpiEventType, KpiPeriod, User } from "@/types/api";

export function KpiEventForm() {
  const router = useRouter();
  const { dict } = useTranslation();
  const [periods, setPeriods] = useState<KpiPeriod[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [eventTypes, setEventTypes] = useState<KpiEventType[]>([]);
  const [apiError, setApiError] = useState("");

  const schema = useMemo(() => createKpiEventSchema(dict.validation), [dict.validation]);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateKpiEventFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: 1 },
  });

  const eventTypeId = watch("eventTypeId");

  useEffect(() => {
    Promise.all([
      kpiPeriodsService.findAll({ status: "OPEN", limit: 100 }),
      usersService.findAll({ role: "EMPLOYEE", limit: 100, sortBy: "fullName", sortOrder: "asc" }),
      kpiEventTypesService.findAll({ limit: 100 }),
    ])
      .then(([periodRes, userRes, typeRes]) => {
        setPeriods(periodRes.data);
        setUsers(userRes.data);
        setEventTypes(typeRes.data.filter((t) => t.isActive));
      })
      .catch(() => setApiError(dict.errors.loadDependencies));
  }, [dict.errors.loadDependencies]);

  useEffect(() => {
    const selected = eventTypes.find((t) => t.id === eventTypeId);
    if (selected) {
      setValue("points", selected.defaultPoints);
    }
  }, [eventTypeId, eventTypes, setValue]);

  async function onSubmit(values: CreateKpiEventFormValues) {
    setApiError("");
    try {
      await kpiEventsService.create({
        ...values,
        evidenceUrl: values.evidenceUrl || undefined,
        occurredAt: values.occurredAt || undefined,
      });
      router.push("/admin/kpi-events");
    } catch (err) {
      setApiError(getApiErrorMessage(err, dict.errors));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
      {apiError && (
        <div className="mb-4 rounded-md border border-danger/30 bg-danger-subtle px-4 py-3 text-[13px] text-danger">
          {apiError}
        </div>
      )}

      <FormSection title={dict.kpiEvents.sectionTitle} description={dict.kpiEvents.sectionDesc}>
        <Controller
          control={control}
          name="periodId"
          render={({ field }) => (
            <Select
              label={dict.kpiEvents.period}
              name={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              options={[
                { value: "", label: dict.kpiEvents.selectPeriod },
                ...periods.map((p) => ({ value: p.id, label: `${p.code} — ${p.name}` })),
              ]}
              error={errors.periodId?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="userId"
          render={({ field }) => (
            <Select
              label={dict.kpiEvents.employee}
              name={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              options={[
                { value: "", label: dict.kpiEvents.selectEmployee },
                ...users.filter((u) => u.isActive).map((u) => ({
                  value: u.id,
                  label: `${u.employeeCode} — ${u.fullName}`,
                })),
              ]}
              error={errors.userId?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="eventTypeId"
          render={({ field }) => (
            <Select
              label={dict.kpiEvents.kind}
              name={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              options={[
                { value: "", label: dict.kpiEvents.selectType },
                ...eventTypes.map((t) => ({
                  value: t.id,
                  label: `${t.name} (${t.eventKind})`,
                })),
              ]}
              error={errors.eventTypeId?.message}
            />
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={dict.kpiEvents.quantity}
            type="number"
            {...register("quantity", { valueAsNumber: true })}
            error={errors.quantity?.message}
          />
          <Input
            label={dict.kpiEvents.customPoints}
            type="number"
            {...register("points", { valueAsNumber: true })}
            helperText={dict.kpiEvents.customPointsHelper}
          />
          <Input
            label={dict.kpiEvents.occurredAt}
            type="datetime-local"
            {...register("occurredAt")}
          />
        </div>
        <Textarea
          label={dict.kpiEvents.note}
          {...register("note")}
          rows={3}
          error={errors.note?.message}
        />
        <Input
          label={dict.kpiEvents.evidenceUrl}
          {...register("evidenceUrl")}
          error={errors.evidenceUrl?.message}
        />
      </FormSection>

      <StickyActionBar>
        <Link href="/admin/kpi-events">
          <Button variant="secondary" type="button">
            {dict.common.cancel}
          </Button>
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? dict.common.saving : dict.kpiEvents.createSubmit}
        </Button>
      </StickyActionBar>
    </form>
  );
}
