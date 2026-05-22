import { z } from "zod"

export const FeatureSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  icon: z.string(),
  is_active: z.boolean(),
})
export type Feature = z.infer<typeof FeatureSchema>

export const FeatureFiltersSchema = z.object({
  is_active: z.boolean().optional(),
})
export type FeatureFilters = z.infer<typeof FeatureFiltersSchema>

export const CreateFeatureRequestSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:_[a-z0-9]+)*$/),
  icon: z.string().max(10).optional(),
})
export type CreateFeatureRequest = z.infer<typeof CreateFeatureRequestSchema>

export const UpdateFeatureRequestSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:_[a-z0-9]+)*$/)
    .optional(),
  icon: z.string().max(10).optional(),
  is_active: z.boolean().optional(),
})
export type UpdateFeatureRequest = z.infer<typeof UpdateFeatureRequestSchema>
