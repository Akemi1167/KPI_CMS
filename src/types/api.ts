export type UserRole = "ADMIN" | "EMPLOYEE";
export type KpiEventKind = "BONUS" | "PENALTY";
export type KpiPeriodStatus = "OPEN" | "CLOSED" | "LOCKED";
export type KpiRating = "Xuất sắc" | "Tốt" | "Đạt" | "Khá" | "Không đạt";

export interface User {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  role: UserRole;
  positionName?: string;
  departmentName?: string;
  managerId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KpiPeriod {
  id: string;
  code: string;
  name: string;
  year: number;
  month: number;
  startDate: string;
  endDate: string;
  status: KpiPeriodStatus;
  baseScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface KpiEventType {
  id: string;
  code: string;
  name: string;
  description?: string;
  eventKind: KpiEventKind;
  defaultPoints: number;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface KpiEvent {
  id: string;
  userId: string;
  periodId: string;
  eventTypeId: string;
  eventKind: KpiEventKind;
  points: number;
  quantity: number;
  totalPoints: number;
  occurredAt: string;
  note?: string;
  evidenceUrl?: string;
  eventTypeSnapshot?: { code: string; name: string };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface KpiResult {
  id: string;
  userId: string;
  periodId: string;
  baseScore: number;
  rawBonusPoints: number;
  bonusPoints: number;
  penaltyPoints: number;
  finalScore: number;
  rating: KpiRating;
  rewardPercent: number;
  isApproved: boolean;
  isLocked: boolean;
  approvedBy?: string;
  calculatedBy?: string;
  lockedBy?: string;
  lockedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  timestamp: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface MessageResponse {
  message: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordPayload {
  newPassword: string;
}

export interface PublicKpiEventType {
  id: string;
  code: string;
  name: string;
  description?: string;
  explanation: string;
  eventKind: KpiEventKind;
  defaultPoints: number;
}

export interface PublicKpiCatalog {
  items: PublicKpiEventType[];
  grouped: {
    bonus: PublicKpiEventType[];
    penalty: PublicKpiEventType[];
  };
  total: number;
}

export interface KpiBreakdownSummary {
  baseScore: number;
  rawBonusPoints: number;
  bonusPoints: number;
  penaltyPoints: number;
  finalScore: number;
  rating: KpiRating;
  rewardPercent: number;
  totalEvents: number;
  bonusEventCount: number;
  penaltyEventCount: number;
}

export interface KpiEventTypeStat {
  eventTypeId: string;
  code: string;
  name: string;
  eventKind: KpiEventKind;
  count: number;
  totalPoints: number;
}

export interface KpiTimelineEntry {
  id: string;
  eventKind: KpiEventKind;
  points: number;
  quantity: number;
  totalPoints: number;
  occurredAt: string;
  eventTypeSnapshot?: { code: string; name: string };
  runningRawBonusPoints: number;
  runningBonusPoints: number;
  runningPenaltyPoints: number;
  runningFinalScore: number;
}

export interface KpiResultBreakdown {
  user: Pick<User, "id" | "fullName" | "employeeCode">;
  period: Pick<KpiPeriod, "id" | "code" | "name" | "status" | "baseScore">;
  result: KpiResult | null;
  summary: KpiBreakdownSummary;
  statisticsByEventType: KpiEventTypeStat[];
  bonusEvents: KpiEvent[];
  penaltyEvents: KpiEvent[];
  timeline: KpiTimelineEntry[];
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  keyword?: string;
}
