import { createApiClient } from "@qonaqta/api"
import { API_URL } from "@/shared/config"

export const apiClient = createApiClient({
  getBaseUrl: () => API_URL,
  tokenKey: "hub_token",
  onUnauthorized: () => { window.location.href = "/login" },
})
