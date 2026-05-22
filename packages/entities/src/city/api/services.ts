import { z } from "zod"
import { getApi } from "../../shared/client"
import { extractApiError } from "../../shared/error"
import { CitySchema, type City } from "../schemas"

/**
 * Get all cities
 * GET /cities
 */
export const getCities = async (): Promise<City[]> => {
  try {
    const res = await getApi().get("/cities")
    const parsed = z.array(CitySchema).safeParse(res.data)
    if (!parsed.success) throw new Error("Failed to parse city list")
    return parsed.data
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to fetch cities")
  }
}
