export interface Booking {
  id: string
  branch_id: number
  user_id: string | null
  date: string
  time_slot: string
  guest_count: number
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show"
  guest_name: string
  guest_phone: string
  table_label: string | null
  notes: string | null
  created_at: string
  cancelled_at: string | null
}

export type BookingStatus = Booking["status"]

export const BOOKING_STATUSES: { value: BookingStatus; label: string; color: string }[] = [
  { value: "pending", label: "Ожидает", color: "bg-yellow-50 text-yellow-700" },
  { value: "confirmed", label: "Подтверждён", color: "bg-blue-50 text-blue-700" },
  { value: "completed", label: "Завершён", color: "bg-green-50 text-green-700" },
  { value: "cancelled", label: "Отменён", color: "bg-red-50 text-red-700" },
  { value: "no_show", label: "Не пришёл", color: "bg-neutral-100 text-neutral-500" },
]
