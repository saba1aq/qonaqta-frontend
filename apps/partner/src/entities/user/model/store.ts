import { create } from "zustand"

interface User { id: number; phone: string; name: string | null; is_superadmin: boolean }
interface AuthState {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  loadFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (token, user) => {
    localStorage.setItem("admin_token", token)
    localStorage.setItem("admin_user", JSON.stringify(user))
    set({ token, user })
  },
  logout: () => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_user")
    set({ token: null, user: null })
  },
  loadFromStorage: () => {
    const token = localStorage.getItem("admin_token")
    const userStr = localStorage.getItem("admin_user")
    if (token && userStr) {
      try { set({ token, user: JSON.parse(userStr) }) } catch { /* ignore */ }
    }
  },
}))
