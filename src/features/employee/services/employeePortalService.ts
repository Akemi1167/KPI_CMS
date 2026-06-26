import { employeeApiClient } from "@/lib/api/employeeApiClient";
import type {
  ApiResponse,
  KpiPeriod,
  KpiResult,
  KpiResultBreakdown,
  PaginatedResponse,
  PublicKpiCatalog,
} from "@/types/api";

export const employeePortalService = {
  getEventTypes(params?: { eventKind?: "BONUS" | "PENALTY" }) {
    return employeeApiClient.get<unknown, ApiResponse<PublicKpiCatalog>>("/kpi-event-types", {
      params,
    });
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
