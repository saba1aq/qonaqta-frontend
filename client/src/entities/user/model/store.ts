import { create } from 'zustand'
import type { User, TokenResponse } from './types'

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (response: TokenResponse) => void
  logout: () => void
  loadFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  login: (response: TokenResponse) => {
    localStorage.setItem('access_token', response.access_token)
    localStorage.setItem('refresh_token', response.refresh_token)
    localStorage.setItem('user', JSON.stringify(response.user))
    set({
      user: response.user,
      accessToken: response.access_token,
      isAuthenticated: true,
    })
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    })
  },

  loadFromStorage: () => {
    const token = localStorage.getItem('access_token')
    const userStr = localStorage.getItem('user')
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User
        set({ user, accessToken: token, isAuthenticated: true })
      } catch {
        set({ user: null, accessToken: null, isAuthenticated: false })
      }
    }
  },
}))
