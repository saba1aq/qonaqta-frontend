import { z } from "zod"
import { CityBriefSchema } from "../city/schemas"
import { CuisineSchema } from "../cuisine/schemas"
import { FeatureSchema } from "../feature/schemas"

export const BranchPhotoSchema = z.object({
  id: z.number(),
  image_url: z.string(),
  sort_order: z.number(),
})
export type BranchPhoto = z.infer<typeof BranchPhotoSchema>

export const BranchScheduleSchema = z.object({
  day_of_week: z.number(),
  open_time: z.string(),
  close_time: z.string(),
  is_closed: z.boolean(),
})
export type BranchSchedule = z.infer<typeof BranchScheduleSchema>

export const BranchStatusSchema = z.object({
  state: z.string(),
  closes_in_minutes: z.number().nullish(),
  open_until: z.string().nullish(),
  opens_at: z.string().nullish(),
  opens_in_days: z.number().nullish(),
})
export type BranchStatus = z.infer<typeof BranchStatusSchema>

export const BranchListSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  cuisines: z.array(CuisineSchema),
  photos: z.array(BranchPhotoSchema),
})
export type BranchList = z.infer<typeof BranchListSchema>

export const BranchDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  phone: z.string().nullable(),
  description: z.string().nullable(),
  instagram: z.string().nullable(),
  telegram: z.string().nullable(),
  tiktok: z.string().nullable(),
  whatsapp: z.string().nullable(),
  website: z.string().nullable(),
  two_gis: z.string().nullable(),
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
  is_active: z.boolean(),
  cuisines: z.array(CuisineSchema),
  features: z.array(FeatureSchema).optional(),
  photos: z.array(BranchPhotoSchema),
  schedules: z.array(BranchScheduleSchema),
  city: z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
  }),
  status: BranchStatusSchema.nullish(),
  today_dow: z.number().nullish(),
})
export type BranchDetail = z.infer<typeof BranchDetailSchema>

export const BranchAdminSchema = z.object({
  id: z.number(),
  city_id: z.number(),
  city: CityBriefSchema.nullish(),
  name: z.string(),
  address: z.string(),
  phone: z.string().nullable(),
  description: z.string().nullable(),
  instagram: z.string().nullable(),
  telegram: z.string().nullable(),
  tiktok: z.string().nullable(),
  whatsapp: z.string().nullable(),
  website: z.string().nullable(),
  two_gis: z.string().nullable(),
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type BranchAdmin = z.infer<typeof BranchAdminSchema>

export const BranchFiltersSchema = z.object({
  city_id: z.number().optional(),
  cuisine_id: z.array(z.number()).optional(),
  skip: z.number().min(0).optional(),
  limit: z.number().min(1).max(100).optional(),
})
export type BranchFilters = z.infer<typeof BranchFiltersSchema>

export const CreateBranchRequestSchema = z.object({
  name: z.string().min(1).max(200),
  city_id: z.number(),
  address: z.string().optional(),
  phone: z.string().nullish(),
  description: z.string().nullish(),
  instagram: z.string().nullish(),
  telegram: z.string().nullish(),
  tiktok: z.string().nullish(),
  whatsapp: z.string().nullish(),
  website: z.string().nullish(),
  two_gis: z.string().nullish(),
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
  cuisine_ids: z.array(z.number()).optional(),
  feature_ids: z.array(z.number()).optional(),
})
export type CreateBranchRequest = z.infer<typeof CreateBranchRequestSchema>

export const UpdateBranchRequestSchema = z.object({
  name: z.string().min(1).max(200).nullish(),
  city_id: z.number().nullish(),
  address: z.string().nullish(),
  phone: z.string().nullish(),
  description: z.string().nullish(),
  instagram: z.string().nullish(),
  telegram: z.string().nullish(),
  tiktok: z.string().nullish(),
  whatsapp: z.string().nullish(),
  website: z.string().nullish(),
  two_gis: z.string().nullish(),
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
  is_active: z.boolean().nullish(),
  cuisine_ids: z.array(z.number()).nullish(),
  feature_ids: z.array(z.number()).nullish(),
})
export type UpdateBranchRequest = z.infer<typeof UpdateBranchRequestSchema>

export const SlotsResponseSchema = z.object({
  slots: z.array(z.string()),
})
export type SlotsResponse = z.infer<typeof SlotsResponseSchema>

export const PhotoResponseSchema = z.object({
  id: z.number(),
  branch_id: z.number(),
  image_url: z.string(),
  sort_order: z.number(),
})
export type PhotoResponse = z.infer<typeof PhotoResponseSchema>

export const ScheduleItemRequestSchema = z.object({
  day_of_week: z.number().min(0).max(7),
  open_time: z.string(),
  close_time: z.string(),
  is_closed: z.boolean().optional(),
})
export type ScheduleItemRequest = z.infer<typeof ScheduleItemRequestSchema>

export const ScheduleResponseSchema = z.object({
  id: z.number(),
  branch_id: z.number(),
  day_of_week: z.number(),
  open_time: z.string(),
  close_time: z.string(),
  is_closed: z.boolean(),
})
export type ScheduleResponse = z.infer<typeof ScheduleResponseSchema>
