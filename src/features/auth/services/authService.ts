import { apiClient } from "@/lib/api/apiClient";
import type { ApiResponse, LoginResponse, User } from "@/types/api";

export const authService = {
  login(email: string, password: string) {
    return apiClient.post<unknown, ApiResponse<LoginResponse>>("/auth/login", {
      email,
      password,
    });
  },

  me() {
    return apiClient.get<unknown, ApiResponse<User>>("/auth/me");
  },

  health() {
    return apiClient.get<unknown, ApiResponse<{ status: string; name: string; version: string }>>(
      "/health",
    );
  },
};
