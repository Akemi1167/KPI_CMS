import axios from "axios";
import { clearAuth, getAccessToken } from "@/lib/auth/tokenStorage";

/** Client for employee BFF routes (Next.js, not proxied to NestJS). */
export const employeeApiClient = axios.create({
  baseURL: "/bff/employee",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

employeeApiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

employeeApiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearAuth();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
