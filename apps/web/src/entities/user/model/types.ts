export interface User {
  id: string
  phone: string
  first_name: string | null
  last_name: string | null
  is_active: boolean
  created_at: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  user: User
}
