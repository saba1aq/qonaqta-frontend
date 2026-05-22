import { z } from "zod"
import { getApi } from "../../shared/client"
import { extractApiError } from "../../shared/error"
import {
  BookingSchema,
  type Booking,
  type BookingFilters,
  type CreateBookingRequest,
  type UpdateBookingStatusRequest,
} from "../schemas"

/**
 * Create booking (public)
 * POST /bookings
 */
export const createBooking = async (
  data: CreateBookingRequest,
): Promise<Booking> => {
  try {
    const res = await getApi().post("/bookings", data)
    const parsed = BookingSchema.safeParse(res.data)
    if (!parsed.success) throw new Error("Failed to parse created booking")
    return parsed.data
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to create booking")
  }
}

/**
 * Get admin bookings list
 * GET /admin/bookings
 */
export const getAdminBookings = async (
  filters?: BookingFilters,
): Promise<Booking[]> => {
  try {
    const params: Record<string, string | number> = {}
    if (filters?.branch_id !== undefined) params.branch_id = filters.branch_id
    if (filters?.date !== undefined) params.date = filters.date
    if (filters?.status !== undefined) params.status = filters.status
    if (filters?.skip !== undefined) params.skip = filters.skip
    if (filters?.limit !== undefined) params.limit = filters.limit

    const res = await getApi().get("/admin/bookings", { params })
    const parsed = z.array(BookingSchema).safeParse(res.data)
    if (!parsed.success) throw new Error("Failed to parse bookings list")
    return parsed.data
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to fetch bookings")
  }
}

/**
 * Update booking status
 * PATCH /admin/bookings/{id}/status
 */
export const updateBookingStatus = async (
  id: string,
  data: UpdateBookingStatusRequest,
): Promise<Booking> => {
  try {
    const res = await getApi().patch(`/admin/bookings/${id}/status`, data)
    const parsed = BookingSchema.safeParse(res.data)
    if (!parsed.success) throw new Error("Failed to parse updated booking")
    return parsed.data
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to update booking status")
  }
}
