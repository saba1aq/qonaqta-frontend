import { z } from "zod"

export const CitySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
})
export type City = z.infer<typeof CitySchema>

export const CityBriefSchema = z.object({
  id: z.number(),
  name: z.string(),
})
export type CityBrief = z.infer<typeof CityBriefSchema>
