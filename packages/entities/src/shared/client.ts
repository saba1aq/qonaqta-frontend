import axios, { type AxiosInstance } from "axios"

export interface EntitiesConfig {
  baseURL: string
  tokenKey: string
  additionalTokenKeys?: string[]
  onUnauthorized?: () => void
}

let instance: AxiosInstance | null = null

export function configureEntities(config: EntitiesConfig): AxiosInstance {
  const client = axios.create({
    baseURL: config.baseURL,
    headers: { "Content-Type": "application/json" },
  })

  client.interceptors.request.use((req) => {
    const token = localStorage.getItem(config.tokenKey)
    if (token) req.headers.Authorization = `Bearer ${token}`
    return req
  })

  client.interceptors.response.use(
    (r) => r,
    (err) => {
      if (err.response?.status === 401 && localStorage.getItem(config.tokenKey)) {
        localStorage.removeItem(config.tokenKey)
        for (const k of config.additionalTokenKeys ?? []) localStorage.removeItem(k)
        config.onUnauthorized?.()
      }
      return Promise.reject(err)
    }
  )

  instance = client
  return client
}

export function getApi(): AxiosInstance {
  if (!instance) {
    throw new Error(
      "@qonaqta/entities: configureEntities() must be called before any API call"
    )
  }
  return instance
}
