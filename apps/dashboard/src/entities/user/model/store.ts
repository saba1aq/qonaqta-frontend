import { create } from "zustand"

export interface HubUser {
  id: string
  phone: string
  first_name: string | null
  last_name: string | null
  is_superadmin: boolean
  is_active: boolean
  created_at: string
}

interface AuthState {
  user: HubUser | null
  token: string | null
  login: (token: string, user: HubUser) => void
  logout: () => void
  loadFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (token, user) => {
    localStorage.setItem("hub_token", token)
    localStorage.setItem("hub_user", JSON.stringify(user))
    set({ token, user })
  },
  logout: () => {
    localStorage.removeItem("hub_token")
    localStorage.removeItem("hub_user")
    set({ token: null, user: null })
  },
  loadFromStorage: () => {
    const token = localStorage.getItem("hub_token")
    const userStr = localStorage.getItem("hub_user")
    if (token && userStr) {
      try {
        set({ token, user: JSON.parse(userStr) })
      } catch { /* ignore */ }
    }
  },
}))
