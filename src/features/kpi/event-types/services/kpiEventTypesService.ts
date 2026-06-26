import { apiClient } from "@/lib/api/apiClient";
import type {
  ApiResponse,
  KpiEventKind,
  KpiEventType,
  PaginatedResponse,
  PaginationQuery,
} from "@/types/api";

export interface KpiEventTypeQuery extends PaginationQuery {
  eventKind?: KpiEventKind;
  includeDeleted?: boolean;
}

export interface CreateKpiEventTypePayload {
  code: string;
  name: string;
  description?: string;
  eventKind: KpiEventKind;
  defaultPoints: number;
}

export interface UpdateKpiEventTypePayload extends Partial<CreateKpiEventTypePayload> {}

export const kpiEventTypesService = {
  findAll(query?: KpiEventTypeQuery) {
    return apiClient.get<unknown, PaginatedResponse<KpiEventType>>("/kpi-event-types", {
      params: query,
    });
  },

  findById(id: string) {
    return apiClient.get<unknown, ApiResponse<KpiEventType>>(`/kpi-event-types/${id}`);
  },

  create(payload: CreateKpiEventTypePayload) {
    return apiClient.post<unknown, ApiResponse<KpiEventType>>("/kpi-event-types", payload);
  },

  update(id: string, payload: UpdateKpiEventTypePayload) {
    return apiClient.patch<unknown, ApiResponse<KpiEventType>>(`/kpi-event-types/${id}`, payload);
  },

  deactivate(id: string) {
    return apiClient.patch<unknown, ApiResponse<KpiEventType>>(`/kpi-event-types/${id}/deactivate`);
  },

  softDelete(id: string) {
    return apiClient.patch<unknown, ApiResponse<KpiEventType>>(`/kpi-event-types/${id}/soft-delete`);
  },

  restore(id: string) {
    return apiClient.patch<unknown, ApiResponse<KpiEventType>>(`/kpi-event-types/${id}/restore`);
  },
};
