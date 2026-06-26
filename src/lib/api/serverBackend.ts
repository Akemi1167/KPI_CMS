import axios from "axios";
import type { User } from "@/types/api";

const backendBaseUrl = process.env.API_PROXY_TARGET ?? "http://localhost:1111/api";

export const backendClient = axios.create({
  baseURL: backendBaseUrl,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

let cachedServiceToken: { token: string; expiresAt: number } | null = null;

function resolveServiceCredentials(): { email: string; password: string } {
  const email = process.env.API_SERVICE_EMAIL?.trim();
  const password = process.env.API_SERVICE_PASSWORD;

  if (email && password) {
    return { email, password };
  }

  // Docker/Jenkins may inject empty strings when vars are unset — treat as missing.
  return { email: "admin@example.com", password: "Admin@123" };
}

export function getBackendErrorMessage(error: unknown, fallback: string): string {
  const data = (error as { response?: { data?: { message?: string | string[] } } })?.response
    ?.data;
  if (!data?.message) return fallback;
  return Array.isArray(data.message) ? data.message.join(", ") : data.message;
}

export async function getServiceAccessToken(): Promise<string> {
  if (cachedServiceToken && Date.now() < cachedServiceToken.expiresAt) {
    return cachedServiceToken.token;
  }

  const { email, password } = resolveServiceCredentials();

  const res = await backendClient.post<{ data: { accessToken: string } }>("/auth/login", {
    email,
    password,
  });

  const token = res.data.data.accessToken;
  cachedServiceToken = {
    token,
    expiresAt: Date.now() + 23 * 60 * 60 * 1000,
  };
  return token;
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
