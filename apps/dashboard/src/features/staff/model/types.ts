export type StaffRole = "owner" | "manager" | "host"

export interface Staff {
  id: number
  brand_id: number
  phone: string
  first_name: string
  last_name: string
  role: StaffRole
  is_active: boolean
  created_at: string
}

export interface CreateStaffPayload {
  phone: string
  first_name: string
  last_name: string
  password: string
  role: StaffRole
}

export interface UpdateStaffPayload {
  first_name?: string
  last_name?: string
  role?: StaffRole
  is_active?: boolean
}

export const ROLE_LABELS: Record<StaffRole, string> = {
  owner: "Владелец",
  manager: "Менеджер",
  host: "Хост",
}

export const ROLE_COLORS: Record<StaffRole, string> = {
  owner: "bg-purple-50 text-purple-600",
  manager: "bg-blue-50 text-blue-600",
  host: "bg-emerald-50 text-emerald-600",
}
