import axios from "axios";
import type { ApiError } from "@/types/api";
import type { Dictionary } from "@/i18n/types";

export function getApiErrorMessage(
  error: unknown,
  messages?: Pick<Dictionary["errors"], "generic" | "network" | "forbidden">,
  fallback?: string,
): string {
  const generic = messages?.generic ?? fallback ?? "Có lỗi xảy ra, vui lòng thử lại";
  const network =
    messages?.network ??
    "Không kết nối được API backend. Hãy đảm bảo NestJS API đang chạy.";
  const forbidden = messages?.forbidden ?? generic;

  if (axios.isAxiosError(error)) {
    if (!error.response && (error.code === "ERR_NETWORK" || error.message === "Network Error")) {
      return network;
    }
    if (error.response?.status === 403) {
      const data = error.response.data as ApiError | undefined;
      if (data?.message === "Forbidden resource" || data?.message === "Forbidden") {
        return forbidden;
      }
    }
    const data = error.response?.data as ApiError | undefined;
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join(", ") : data.message;
    }
    return error.message || generic;
  }
  if (error instanceof Error) return error.message;
  return generic;
}
