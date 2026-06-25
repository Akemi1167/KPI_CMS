import { employeeApiClient } from "@/lib/api/employeeApiClient";
import type {
  ApiResponse,
  KpiEventType,
  KpiPeriod,
  KpiResult,
  KpiResultBreakdown,
  PaginatedResponse,
} from "@/types/api";

export const employeePortalService = {
  getEventTypes() {
    return employeeApiClient.get<unknown, PaginatedResponse<KpiEventType>>("/kpi-event-types");
  },

  getPeriods(params?: { page?: number; limit?: number; sortOrder?: "asc" | "desc" }) {
    return employeeApiClient.get<unknown, PaginatedResponse<KpiPeriod>>("/kpi-periods", {
      params,
    });
  },

  getMyResults(params?: { page?: number; limit?: number; periodId?: string }) {
    return employeeApiClient.get<unknown, PaginatedResponse<KpiResult>>("/kpi-results", {
      params,
    });
  },

  getBreakdownById(id: string) {
    return employeeApiClient.get<unknown, ApiResponse<KpiResultBreakdown>>(
      `/kpi-results/${id}/breakdown`,
    );
  },
};
