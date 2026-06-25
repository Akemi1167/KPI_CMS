import { apiClient } from "@/lib/api/apiClient";
import type { ApiResponse, PaginatedResponse, PaginationQuery, User, UserRole } from "@/types/api";

export interface UserQuery extends PaginationQuery {
  role?: UserRole;
}

export interface CreateUserPayload {
  employeeCode: string;
  fullName: string;
  email: string;
  password: string;
  role?: UserRole;
  positionName?: string;
  departmentName?: string;
  managerId?: string;
}

export interface UpdateUserPayload {
  employeeCode?: string;
  fullName?: string;
  email?: string;
  role?: UserRole;
  positionName?: string;
  departmentName?: string;
  managerId?: string;
}

export const usersService = {
  findAll(query?: UserQuery) {
    return apiClient.get<unknown, PaginatedResponse<User>>("/users", { params: query });
  },

  findById(id: string) {
    return apiClient.get<unknown, ApiResponse<User>>(`/users/${id}`);
  },

  create(payload: CreateUserPayload) {
    return apiClient.post<unknown, ApiResponse<User>>("/users", payload);
  },

  update(id: string, payload: UpdateUserPayload) {
    return apiClient.patch<unknown, ApiResponse<User>>(`/users/${id}`, payload);
  },

  activate(id: string) {
    return apiClient.patch<unknown, ApiResponse<User>>(`/users/${id}/activate`);
  },

  deactivate(id: string) {
    return apiClient.patch<unknown, ApiResponse<User>>(`/users/${id}/deactivate`);
  },
};
