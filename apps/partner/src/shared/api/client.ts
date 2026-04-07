import { createApiClient } from "@qonaqta/api"

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1"

export const apiClient = createApiClient({
  getBaseUrl: () => API_URL,
  tokenKey: "admin_token",
  onUnauthorized: () => { window.location.href = "/login" },
})
