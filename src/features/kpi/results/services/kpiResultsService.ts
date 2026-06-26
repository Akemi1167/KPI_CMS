import { apiClient } from "@/lib/api/apiClient";
import { downloadApiBlob } from "@/lib/api/downloadBlob";
import type { ApiResponse, KpiResult, KpiResultBreakdown, PaginatedResponse, PaginationQuery } from "@/types/api";

export interface KpiResultQuery extends PaginationQuery {
  userId?: string;
  periodId?: string;
}

export interface CalculateKpiPayload {
  userId: string;
  periodId: string;
}

export const kpiResultsService = {
  findAll(query?: KpiResultQuery) {
    return apiClient.get<unknown, PaginatedResponse<KpiResult>>("/kpi-results", { params: query });
  },

  calculate(payload: CalculateKpiPayload) {
    return apiClient.post<unknown, ApiResponse<KpiResult>>("/kpi-results/calculate", payload);
  },

  calculatePeriod(periodId: string) {
    return apiClient.post<unknown, ApiResponse<{ total: number; results: KpiResult[] }>>(
      `/kpi-results/calculate-period/${periodId}`,
    );
  },

  approve(id: string) {
    return apiClient.patch<unknown, ApiResponse<KpiResult>>(`/kpi-results/${id}/approve`);
  },

  lock(id: string) {
    return apiClient.patch<unknown, ApiResponse<KpiResult>>(`/kpi-results/${id}/lock`);
  },

  getBreakdown(userId: string, periodId: string) {
    return apiClient.get<unknown, ApiResponse<KpiResultBreakdown>>("/kpi-results/breakdown", {
      params: { userId, periodId },
    });
  },

  getBreakdownById(id: string) {
    return apiClient.get<unknown, ApiResponse<KpiResultBreakdown>>(`/kpi-results/${id}/breakdown`);
  },

  exportReport(periodId: string) {
    return downloadApiBlob("/kpi-results/export", {
      params: { periodId },
      fallbackFilename: `bao-cao-kpi-${periodId}.xlsx`,
    });
  },
};
