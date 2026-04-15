import type { Reservation } from "../model/types"

export interface ApiBooking {
  id: string
  branch_id: number
  branch_name: string
  guest_phone: string
  guest_name: string
  start_time: string
  guests_count: number
  status: string
  table_label: string | null
}

export function mapApiBooking(b: ApiBooking): Reservation {
  const start = new Date(b.start_time)
  const startTime = `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`
  const endDate = new Date(start.getTime() + 2 * 60 * 60 * 1000)
  const endTime = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`
  return {
    id: b.id,
    guestName: b.guest_name || "Гость",
    guestPhone: b.guest_phone,
    partySize: b.guests_count,
    startTime,
    endTime,
    tableLabel: b.table_label ?? undefined,
    status: (b.status as Reservation["status"]) ?? "pending",
  }
}
