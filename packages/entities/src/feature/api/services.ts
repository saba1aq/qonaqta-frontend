import { z } from "zod"
import { getApi } from "../../shared/client"
import { extractApiError } from "../../shared/error"
import {
  FeatureSchema,
  type CreateFeatureRequest,
  type Feature,
  type FeatureFilters,
  type UpdateFeatureRequest,
} from "../schemas"

/**
 * Get public features list
 * GET /features
 */
export const getFeatures = async (
  filters?: FeatureFilters,
): Promise<Feature[]> => {
  try {
    const params: Record<string, boolean> = {}
    if (filters?.is_active !== undefined) params.is_active = filters.is_active
    const res = await getApi().get("/features", { params })
    const parsed = z.array(FeatureSchema).safeParse(res.data)
    if (!parsed.success) throw new Error("Failed to parse feature list")
    return parsed.data
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to fetch features")
  }
}

/**
 * Get admin features list
 * GET /admin/features
 */
export const getAdminFeatures = async (): Promise<Feature[]> => {
  try {
    const res = await getApi().get("/admin/features")
    const parsed = z.array(FeatureSchema).safeParse(res.data)
    if (!parsed.success) throw new Error("Failed to parse admin feature list")
    return parsed.data
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to fetch features")
  }
}

/**
 * Create feature
 * POST /admin/features
 */
export const createFeature = async (
  data: CreateFeatureRequest,
): Promise<Feature> => {
  try {
    const res = await getApi().post("/admin/features", data)
    const parsed = FeatureSchema.safeParse(res.data)
    if (!parsed.success) throw new Error("Failed to parse created feature")
    return parsed.data
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to create feature")
  }
}

/**
 * Update feature
 * PATCH /admin/features/{id}
 */
export const updateFeature = async (
  id: number,
  data: UpdateFeatureRequest,
): Promise<Feature> => {
  try {
    const res = await getApi().patch(`/admin/features/${id}`, data)
    const parsed = FeatureSchema.safeParse(res.data)
    if (!parsed.success) throw new Error("Failed to parse updated feature")
    return parsed.data
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to update feature")
  }
}

/**
 * Delete feature
 * DELETE /admin/features/{id}
 */
export const deleteFeature = async (id: number): Promise<void> => {
  try {
    await getApi().delete(`/admin/features/${id}`)
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to delete feature")
  }
}
