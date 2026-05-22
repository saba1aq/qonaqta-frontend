import { z } from "zod";
import { getApi } from "../../shared/client";
import { extractApiError } from "../../shared/error";
import {
  BranchAdminSchema,
  BranchDetailSchema,
  BranchListSchema,
  PhotoResponseSchema,
  ScheduleResponseSchema,
  SlotsResponseSchema,
  type BranchAdmin,
  type BranchDetail,
  type BranchFilters,
  type BranchList,
  type CreateBranchRequest,
  type PhotoResponse,
  type ScheduleItemRequest,
  type ScheduleResponse,
  type SlotsResponse,
  type UpdateBranchRequest,
} from "../schemas";

/**
 * Get public restaurants list
 * GET /restaurants
 */
export const getBranchList = async (
  filters?: BranchFilters,
): Promise<BranchList[]> => {
  try {
    const params: Record<string, string | number> = {};
    if (filters?.city_id !== undefined) params.city_id = filters.city_id;
    if (filters?.cuisine_id?.length)
      params.cuisine_id = filters.cuisine_id.join(",");
    if (filters?.skip !== undefined) params.skip = filters.skip;
    if (filters?.limit !== undefined) params.limit = filters.limit;

    const res = await getApi().get("/restaurants", { params });
    const parsed = z.array(BranchListSchema).safeParse(res.data);
    if (!parsed.success) throw new Error("Failed to parse restaurant list");
    return parsed.data;
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to fetch restaurants");
  }
};

/**
 * Get public restaurant detail
 * GET /restaurants/{id}
 */
export const getBranchDetail = async (id: number): Promise<BranchDetail> => {
  try {
    const res = await getApi().get(`/restaurants/${id}`);
    const parsed = BranchDetailSchema.safeParse(res.data);
    if (!parsed.success) throw new Error("Failed to parse restaurant detail");
    return parsed.data;
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to fetch restaurant");
  }
};

/**
 * Get booking slots for a restaurant on a given date
 * GET /restaurants/{id}/slots?date=YYYY-MM-DD
 */
export const getBranchSlots = async (
  id: number,
  date: string,
): Promise<SlotsResponse> => {
  try {
    const res = await getApi().get(`/restaurants/${id}/slots`, {
      params: { date },
    });
    const parsed = SlotsResponseSchema.safeParse(res.data);
    if (!parsed.success) throw new Error("Failed to parse slots response");
    return parsed.data;
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to fetch slots");
  }
};

/**
 * Get admin restaurants list
 * GET /admin/restaurants
 */
export const getAdminBranchList = async (): Promise<BranchAdmin[]> => {
  try {
    const res = await getApi().get("/admin/restaurants");
    const parsed = z.array(BranchAdminSchema).safeParse(res.data);
    if (!parsed.success) throw new Error("Failed to parse admin restaurants");
    return parsed.data;
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to fetch admin restaurants");
  }
};

/**
 * Get admin restaurant detail
 * GET /admin/restaurants/{id}
 */
export const getAdminBranchDetail = async (
  id: number,
): Promise<BranchDetail> => {
  try {
    const res = await getApi().get(`/admin/restaurants/${id}`);
    const parsed = BranchDetailSchema.safeParse(res.data);
    if (!parsed.success) throw new Error("Failed to parse admin restaurant");
    return parsed.data;
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to fetch admin restaurant");
  }
};

/**
 * Create restaurant
 * POST /admin/restaurants
 */
export const createBranch = async (
  data: CreateBranchRequest,
): Promise<BranchAdmin> => {
  try {
    const res = await getApi().post("/admin/restaurants", data);
    const parsed = BranchAdminSchema.safeParse(res.data);
    if (!parsed.success) throw new Error("Failed to parse created restaurant");
    return parsed.data;
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to create restaurant");
  }
};

/**
 * Update restaurant
 * PATCH /admin/restaurants/{id}
 */
export const updateBranch = async (
  id: number,
  data: UpdateBranchRequest,
): Promise<BranchAdmin> => {
  try {
    const res = await getApi().patch(`/admin/restaurants/${id}`, data);
    const parsed = BranchAdminSchema.safeParse(res.data);
    if (!parsed.success) throw new Error("Failed to parse updated restaurant");
    return parsed.data;
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to update restaurant");
  }
};

/**
 * Delete restaurant
 * DELETE /admin/restaurants/{id}
 */
export const deleteBranch = async (id: number): Promise<void> => {
  try {
    await getApi().delete(`/admin/restaurants/${id}`);
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to delete restaurant");
  }
};

/**
 * Upload photo for restaurant
 * POST /admin/restaurants/{id}/photos
 */
export const uploadBranchPhoto = async (
  id: number,
  file: File,
): Promise<PhotoResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await getApi().post(
      `/admin/restaurants/${id}/photos`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    const parsed = PhotoResponseSchema.safeParse(res.data);
    if (!parsed.success) throw new Error("Failed to parse uploaded photo");
    return parsed.data;
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to upload photo");
  }
};

/**
 * Delete photo from restaurant
 * DELETE /admin/restaurants/{id}/photos/{photoId}
 */
export const deleteBranchPhoto = async (
  id: number,
  photoId: number,
): Promise<void> => {
  try {
    await getApi().delete(`/admin/restaurants/${id}/photos/${photoId}`);
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to delete photo");
  }
};

/**
 * Update restaurant schedules
 * PUT /admin/restaurants/{id}/schedules
 */
export const updateBranchSchedules = async (
  id: number,
  schedules: ScheduleItemRequest[],
): Promise<ScheduleResponse[]> => {
  try {
    const res = await getApi().put(
      `/admin/restaurants/${id}/schedules`,
      schedules,
    );
    const parsed = z.array(ScheduleResponseSchema).safeParse(res.data);
    if (!parsed.success) throw new Error("Failed to parse schedules response");
    return parsed.data;
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to update schedules");
  }
};
