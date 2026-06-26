import axios, { type AxiosRequestConfig } from "axios";
import { clearAuth, getAccessToken } from "@/lib/auth/tokenStorage";
import type { ApiError } from "@/types/api";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

async function parseBlobError(data: Blob): Promise<ApiError | null> {
  try {
    const text = await data.text();
    return JSON.parse(text) as ApiError;
  } catch {
    return null;
  }
}

export async function downloadApiBlob(
  path: string,
  options?: {
    params?: Record<string, string>;
    fallbackFilename?: string;
  },
): Promise<void> {
  const token = getAccessToken();
  const config: AxiosRequestConfig = {
    params: options?.params,
    responseType: "blob",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  };

  try {
    const response = await axios.get(`${apiBaseUrl}${path}`, config);

    if (response.status === 401 && typeof window !== "undefined") {
      clearAuth();
      window.location.href = "/login";
      return;
    }

    const contentType = String(response.headers["content-type"] ?? "");
    if (contentType.includes("application/json")) {
      const apiError = await parseBlobError(response.data);
      throw apiError ?? { statusCode: response.status, message: "Download failed" };
    }

    const disposition = String(response.headers["content-disposition"] ?? "");
    const filename =
      disposition.match(/filename="(.+)"/)?.[1] ??
      options?.fallbackFilename ??
      "download.xlsx";

    const blob = new Blob([response.data], { type: contentType || undefined });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
      const apiError = await parseBlobError(error.response.data);
      if (apiError) throw apiError;
    }
    throw error;
  }
}
