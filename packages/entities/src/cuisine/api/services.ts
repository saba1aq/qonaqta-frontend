import { z } from "zod"
import { getApi } from "../../shared/client"
import { extractApiError } from "../../shared/error"
import {
  CuisineSchema,
  type Cuisine,
  type CuisineFilters,
  type CreateCuisineRequest,
  type UpdateCuisineRequest,
} from "../schemas"

/**
 * Get public cuisines list
 * GET /cuisines
 */
export const getCuisines = async (
  filters?: CuisineFilters,
): Promise<Cuisine[]> => {
  try {
    const params: Record<string, boolean> = {}
    if (filters?.is_active !== undefined) params.is_active = filters.is_active
    const res = await getApi().get("/cuisines", { params })
    const parsed = z.array(CuisineSchema).safeParse(res.data)
    if (!parsed.success) throw new Error("Failed to parse cuisine list")
    return parsed.data
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to fetch cuisines")
  }
}

/**
 * Get admin cuisines list
 * GET /admin/cuisines
 */
export const getAdminCuisines = async (): Promise<Cuisine[]> => {
  try {
    const res = await getApi().get("/admin/cuisines")
    const parsed = z.array(CuisineSchema).safeParse(res.data)
    if (!parsed.success) throw new Error("Failed to parse admin cuisine list")
    return parsed.data
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to fetch cuisines")
  }
}

/**
 * Create cuisine
 * POST /admin/cuisines
 */
export const createCuisine = async (
  data: CreateCuisineRequest,
): Promise<Cuisine> => {
  try {
    const res = await getApi().post("/admin/cuisines", data)
    const parsed = CuisineSchema.safeParse(res.data)
    if (!parsed.success) throw new Error("Failed to parse created cuisine")
    return parsed.data
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to create cuisine")
  }
}

/**
 * Update cuisine
 * PATCH /admin/cuisines/{id}
 */
export const updateCuisine = async (
  id: number,
  data: UpdateCuisineRequest,
): Promise<Cuisine> => {
  try {
    const res = await getApi().patch(`/admin/cuisines/${id}`, data)
    const parsed = CuisineSchema.safeParse(res.data)
    if (!parsed.success) throw new Error("Failed to parse updated cuisine")
    return parsed.data
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to update cuisine")
  }
}

/**
 * Delete cuisine
 * DELETE /admin/cuisines/{id}
 */
export const deleteCuisine = async (id: number): Promise<void> => {
  try {
    await getApi().delete(`/admin/cuisines/${id}`)
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to delete cuisine")
  }
}
