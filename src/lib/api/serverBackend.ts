import axios from "axios";
import type { User } from "@/types/api";

const backendBaseUrl = process.env.API_PROXY_TARGET ?? "http://localhost:1111/api";

export const backendClient = axios.create({
  baseURL: backendBaseUrl,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

let cachedServiceToken: { token: string; expiresAt: number } | null = null;

export async function getServiceAccessToken(): Promise<string> {
  if (cachedServiceToken && Date.now() < cachedServiceToken.expiresAt) {
    return cachedServiceToken.token;
  }

  const email = process.env.API_SERVICE_EMAIL ?? "admin@example.com";
  const password = process.env.API_SERVICE_PASSWORD ?? "Admin@123";

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
