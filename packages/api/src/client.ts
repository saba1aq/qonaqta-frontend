import axios, { type AxiosInstance } from "axios"

export interface ApiClientConfig {
  getBaseUrl: () => string
  tokenKey: string
  additionalTokenKeys?: string[]
  onUnauthorized: () => void
}

export function createApiClient(config: ApiClientConfig): AxiosInstance {
  const client = axios.create({
    baseURL: config.getBaseUrl(),
    headers: { "Content-Type": "application/json" },
  })

  client.interceptors.request.use((reqConfig) => {
    const token = localStorage.getItem(config.tokenKey)
    if (token) reqConfig.headers.Authorization = `Bearer ${token}`
    return reqConfig
  })

  client.interceptors.response.use(
    (r) => r,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem(config.tokenKey)
        for (const key of config.additionalTokenKeys ?? []) {
          localStorage.removeItem(key)
        }
        config.onUnauthorized()
      }
      return Promise.reject(error)
    }
  )

  return client
}
