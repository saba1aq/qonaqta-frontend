import { z } from "zod"

export const BookingStatusSchema = z.enum([
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "no_show",
])
export type BookingStatus = z.infer<typeof BookingStatusSchema>

export const BookingContactMethodSchema = z.enum(["phone", "whatsapp"])
export type BookingContactMethod = z.infer<typeof BookingContactMethodSchema>

export const BookingSchema = z.object({
  id: z.string().uuid(),
  branch_id: z.number(),
  user_id: z.string().uuid().nullable(),
  date: z.string(),
  time_slot: z.string(),
  guest_count: z.number(),
  status: z.string(),
  guest_name: z.string(),
  guest_phone: z.string(),
  contact_method: z.string(),
  notes: z.string().nullable(),
  created_at: z.string(),
})
export type Booking = z.infer<typeof BookingSchema>

export const CreateBookingRequestSchema = z.object({
  branch_id: z.number(),
  date: z.string(),
  time_slot: z.string().regex(/^\d{2}:\d{2}$/),
  guest_count: z.number().min(1).max(20),
  guest_name: z.string().min(1),
  guest_phone: z.string().min(1),
  contact_method: BookingContactMethodSchema.optional(),
  notes: z.string().nullish(),
})
export type CreateBookingRequest = z.infer<typeof CreateBookingRequestSchema>

export const UpdateBookingStatusRequestSchema = z.object({
  status: BookingStatusSchema,
})
export type UpdateBookingStatusRequest = z.infer<
  typeof UpdateBookingStatusRequestSchema
>

export const BookingFiltersSchema = z.object({
  branch_id: z.number().optional(),
  date: z.string().optional(),
  status: z.string().optional(),
  skip: z.number().min(0).optional(),
  limit: z.number().min(1).max(200).optional(),
})
export type BookingFilters = z.infer<typeof BookingFiltersSchema>
