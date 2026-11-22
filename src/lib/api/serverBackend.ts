import axios from "axios";
import type { User } from "@/types/api";

const backendBaseUrl = process.env.API_PROXY_TARGET ?? "http://localhost:1111/api";

export const backendClient = axios.create({
  baseURL: backendBaseUrl,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

export function getBackendErrorMessage(error: unknown, fallback: string): string {
  const data = (error as { response?: { data?: { message?: string | string[] } } })?.response
    ?.data;
  if (!data?.message) return fallback;
  return Array.isArray(data.message) ? data.message.join(", ") : data.message;
}

export function getRequestAuthorization(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth;
}

export function backendErrorResponse(error: unknown, fallback: string) {
  const status =
    (error as { response?: { status?: number } })?.response?.status ?? 500;
  const message = getBackendErrorMessage(error, fallback);
  return Response.json({ statusCode: status, message }, { status });
}

export async function getUserFromBearer(request: Request): Promise<User | null> {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;

  try {
    const res = await backendClient.get<{ data: User }>("/auth/me", {
      headers: { Authorization: auth },
    });
    return res.data.data;
  } catch {
    return null;
  }
}

export async function requireEmployeeUser(request: Request): Promise<User | null> {
  const user = await getUserFromBearer(request);
  if (!user?.isActive || user.role !== "EMPLOYEE") return null;
  return user;
}

export function forbiddenResponse(message = "Forbidden resource") {
  return Response.json(
    { statusCode: 403, message, error: "Forbidden" },
    { status: 403 },
  );
}

export function unauthorizedResponse() {
  return Response.json(
    { statusCode: 401, message: "Unauthorized", error: "Unauthorized" },
    { status: 401 },
  );
}
