import type { KpiRating } from "@/types/api";

export function formatKpiPoint(value: number): string {
  if (value > 0) return `+${value}`;
  return `${value}`;
}

export function formatBonusRate(value: number): string {
  return `${value}%`;
}

export function formatPeriodLabel(year: number, month: number): string {
  return `KPI tháng ${String(month).padStart(2, "0")}/${year}`;
}

export function getRatingColorClass(rating: KpiRating): string {
  switch (rating) {
    case "Xuất sắc":
      return "text-success";
    case "Tốt":
      return "text-info";
    case "Đạt":
      return "text-warning";
    case "Không thưởng":
      return "text-text-muted";
    default:
      return "text-text-secondary";
  }
}

export function getPeriodStatusVariant(
  status: string,
): "success" | "warning" | "inactive" | "danger" {
  switch (status) {
    case "OPEN":
      return "success";
    case "CLOSED":
      return "warning";
    case "LOCKED":
      return "danger";
    default:
      return "inactive";
  }
}
