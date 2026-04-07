import { createApiClient } from "@qonaqta/api"
import { API_URL } from "@/shared/config"

export const apiClient = createApiClient({
  getBaseUrl: () => API_URL,
  tokenKey: "access_token",
  additionalTokenKeys: ["refresh_token"],
  onUnauthorized: () => { window.location.href = "/auth" },
})
