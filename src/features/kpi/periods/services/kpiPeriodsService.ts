import { apiClient } from "@/lib/api/apiClient";
import type {
  ApiResponse,
  KpiPeriod,
  KpiPeriodStatus,
  PaginatedResponse,
  PaginationQuery,
} from "@/types/api";

export interface KpiPeriodQuery extends PaginationQuery {
  status?: KpiPeriodStatus;
  year?: number;
  month?: number;
}

export interface CreateKpiPeriodPayload {
  name: string;
  startDate: string;
  endDate: string;
  baseScore?: number;
  code?: string;
  year?: number;
  month?: number;
}

export interface UpdateKpiPeriodPayload extends Partial<CreateKpiPeriodPayload> {}

export const kpiPeriodsService = {
  findAll(query?: KpiPeriodQuery) {
    return apiClient.get<unknown, PaginatedResponse<KpiPeriod>>("/kpi-periods", { params: query });
  },

  findById(id: string) {
    return apiClient.get<unknown, ApiResponse<KpiPeriod>>(`/kpi-periods/${id}`);
  },

  create(payload: CreateKpiPeriodPayload) {
    return apiClient.post<unknown, ApiResponse<KpiPeriod>>("/kpi-periods", payload);
  },

  update(id: string, payload: UpdateKpiPeriodPayload) {
    return apiClient.patch<unknown, ApiResponse<KpiPeriod>>(`/kpi-periods/${id}`, payload);
  },

  close(id: string) {
    return apiClient.patch<unknown, ApiResponse<KpiPeriod>>(`/kpi-periods/${id}/close`);
  },

  lock(id: string) {
    return apiClient.patch<unknown, ApiResponse<KpiPeriod>>(`/kpi-periods/${id}/lock`);
  },
};
