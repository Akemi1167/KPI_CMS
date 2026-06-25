import type { User, UserRole } from "@/types/api";

export function isActiveUser(user?: User | null): boolean {
  return Boolean(user?.isActive);
}

export function isAdmin(user?: User | null): boolean {
  return Boolean(user && user.role === "ADMIN" && user.isActive);
}

export function isEmployee(user?: User | null): boolean {
  return Boolean(user && user.role === "EMPLOYEE" && user.isActive);
}

export function canAccessCms(user?: User | null): boolean {
  return isAdmin(user) || isEmployee(user);
}

export function getHomeRoute(role: UserRole): string {
  return role === "ADMIN" ? "/admin" : "/employee/my-kpi";
}
