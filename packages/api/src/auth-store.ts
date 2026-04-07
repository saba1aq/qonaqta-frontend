import { create } from "zustand"

export interface AuthStoreConfig {
  tokenKey: string
  userKey: string
  additionalTokenKeys?: string[]
}

export interface AuthState<TUser> {
  user: TUser | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (token: string, user: TUser, additionalTokens?: Record<string, string>) => void
  logout: () => void
  loadFromStorage: () => void
}

export function createAuthStore<TUser>(config: AuthStoreConfig) {
  return create<AuthState<TUser>>((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,

    login: (token, user, additionalTokens) => {
      localStorage.setItem(config.tokenKey, token)
      localStorage.setItem(config.userKey, JSON.stringify(user))
      if (additionalTokens) {
        for (const [key, value] of Object.entries(additionalTokens)) {
          localStorage.setItem(key, value)
        }
      }
      set({ user, accessToken: token, isAuthenticated: true })
    },

    logout: () => {
      localStorage.removeItem(config.tokenKey)
      localStorage.removeItem(config.userKey)
      for (const key of config.additionalTokenKeys ?? []) {
        localStorage.removeItem(key)
      }
      set({ user: null, accessToken: null, isAuthenticated: false })
    },

    loadFromStorage: () => {
      const token = localStorage.getItem(config.tokenKey)
      const userStr = localStorage.getItem(config.userKey)
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr) as TUser
          set({ user, accessToken: token, isAuthenticated: true })
        } catch {
          set({ user: null, accessToken: null, isAuthenticated: false })
        }
      }
    },
  }))
}
