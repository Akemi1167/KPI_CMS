import { z } from "zod";
import type { Dictionary } from "@/i18n/types";

export function createKpiEventSchema(v: Dictionary["validation"]) {
  return z.object({
    userId: z.string().min(1, v.selectEmployee),
    periodId: z.string().min(1, v.selectPeriod),
    eventTypeId: z.string().min(1, v.selectEventType),
    quantity: z.number().min(1, v.quantityMin),
    points: z.number().optional(),
    occurredAt: z.string().optional(),
    note: z.string().max(1000, v.noteMax).optional(),
    evidenceUrl: z.string().url(v.invalidEvidenceUrl).optional().or(z.literal("")),
  });
}

export type CreateKpiEventFormValues = z.infer<ReturnType<typeof createKpiEventSchema>>;
