import { isAxiosError } from "axios"

import { ERROR_REGISTRY } from "./error-registry"
import { ApiError } from "./errors"

type EnvelopedError = { error?: { code?: unknown; message?: unknown } }
type FastApiError = { detail?: unknown; message?: unknown }

function fromEnvelope(data: unknown): ApiError | null {
  if (!data || typeof data !== "object") return null
  const envelope = (data as EnvelopedError).error
  if (!envelope || typeof envelope !== "object") return null
  const code = typeof envelope.code === "string" ? envelope.code : undefined
  const message = typeof envelope.message === "string" ? envelope.message : undefined
  if (!code) return null
  const Ctor = ERROR_REGISTRY[code]
  if (Ctor) return new Ctor(message)
  const fallback = new ApiError(message)
  Object.defineProperty(fallback, "code", { value: code, enumerable: true })
  return fallback
}

export function extractApiError(error: unknown, fallback: string): ApiError {
  if (isAxiosError(error)) {
    const data = error.response?.data as unknown

    const fromBackend = fromEnvelope(data)
    if (fromBackend) return fromBackend

    const legacy = data as FastApiError | undefined
    const detail = legacy?.detail
    if (typeof detail === "string") return new ApiError(detail)
    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0] as { msg?: unknown } | undefined
      if (first && typeof first.msg === "string") return new ApiError(first.msg)
    }
    if (typeof legacy?.message === "string") return new ApiError(legacy.message)
    return new ApiError(error.message || fallback)
  }
  if (error instanceof ApiError) return error
  if (error instanceof Error) return new ApiError(error.message || fallback)
  return new ApiError(fallback)
}
