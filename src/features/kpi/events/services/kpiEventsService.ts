import { apiClient } from "@/lib/api/apiClient";
import type {
  ApiResponse,
  KpiEvent,
  KpiEventKind,
  PaginatedResponse,
  PaginationQuery,
} from "@/types/api";

export interface KpiEventQuery extends PaginationQuery {
  userId?: string;
  periodId?: string;
  eventKind?: KpiEventKind;
}

export interface CreateKpiEventPayload {
  userId: string;
  periodId: string;
  eventTypeId: string;
  points?: number;
  quantity?: number;
  occurredAt?: string;
  note?: string;
  evidenceUrl?: string;
}

export const kpiEventsService = {
  findAll(query?: KpiEventQuery) {
    return apiClient.get<unknown, PaginatedResponse<KpiEvent>>("/kpi-events", { params: query });
  },

  create(payload: CreateKpiEventPayload) {
    return apiClient.post<unknown, ApiResponse<KpiEvent>>("/kpi-events", payload);
  },

  remove(id: string) {
    return apiClient.delete<unknown, ApiResponse<{ success: boolean }>>(`/kpi-events/${id}`);
  },
};
