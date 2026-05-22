import { z } from "zod"

export const CuisineSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  is_active: z.boolean(),
})
export type Cuisine = z.infer<typeof CuisineSchema>

export const CuisineFiltersSchema = z.object({
  is_active: z.boolean().optional(),
})
export type CuisineFilters = z.infer<typeof CuisineFiltersSchema>

export const CreateCuisineRequestSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
})
export type CreateCuisineRequest = z.infer<typeof CreateCuisineRequestSchema>

export const UpdateCuisineRequestSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  is_active: z.boolean().optional(),
})
export type UpdateCuisineRequest = z.infer<typeof UpdateCuisineRequestSchema>
