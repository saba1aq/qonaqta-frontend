import { isAxiosError } from "axios";

export function extractApiError(error: unknown, fallback: string): Error {
  if (isAxiosError(error)) {
    const data = error.response?.data as
      | { detail?: unknown; message?: unknown }
      | undefined;
    const detail = data?.detail;
    if (typeof detail === "string") return new Error(detail);
    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0] as { msg?: unknown } | undefined;
      if (first && typeof first.msg === "string") return new Error(first.msg);
    }
    if (typeof data?.message === "string") return new Error(data.message);
    return new Error(error.message || fallback);
  }
  if (error instanceof Error) return new Error(error.message || fallback);
  return new Error(fallback);
}
