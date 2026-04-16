import type { Staff } from "../model/types"

let idCounter = 100

export function nextStaffId(): number {
  return ++idCounter
}

export const mockStaff: Staff[] = [
  {
    id: 1,
    brand_id: 1,
    phone: "+7 777 111 22 33",
    first_name: "Алишер",
    last_name: "Нурым",
    role: "owner",
    is_active: true,
    created_at: "2026-03-01T10:00:00Z",
  },
  {
    id: 2,
    brand_id: 1,
    phone: "+7 701 222 33 44",
    first_name: "Мадина",
    last_name: "Касенова",
    role: "manager",
    is_active: true,
    created_at: "2026-03-10T10:00:00Z",
  },
]
