export interface CreateBookingRequest {
  branch_id: number
  date: string
  time_slot: string
  guest_count: number
  guest_name: string
  guest_phone: string
  notes?: string
}

export interface Booking {
  id: string
  branch_id: number
  table_id: number
  user_id: string | null
  date: string
  time_slot: string
  guest_count: number
  status: string
  guest_name: string
  guest_phone: string
  deposit_amount: number | null
  notes: string | null
  created_at: string
  cancelled_at: string | null
}
