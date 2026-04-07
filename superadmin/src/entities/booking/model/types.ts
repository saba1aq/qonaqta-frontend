export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show"

export type Booking = {
  id: string
  branch_id: string
  branch_name: string
  guest_phone: string
  guest_name: string
  start_time: string
  guests_count: number
  status: BookingStatus
  table_number: string | null
}
