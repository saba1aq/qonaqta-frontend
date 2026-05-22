import { useMutation, useQueryClient } from "@tanstack/react-query"
import { restaurantKeys } from "./keys"
import {
  createBranch,
  deleteBranch,
  deleteBranchPhoto,
  updateBranch,
  updateBranchSchedules,
  uploadBranchPhoto,
} from "./services"
import type {
  CreateBranchRequest,
  ScheduleItemRequest,
  UpdateBranchRequest,
} from "../schemas"

export const useCreateBranch = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBranchRequest) => createBranch(data),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: restaurantKeys.admin.all })
    },
  })
}

export const useUpdateBranch = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBranchRequest }) =>
      updateBranch(id, data),
    onSettled: (_d, _e, { id }) => {
      qc.invalidateQueries({ queryKey: restaurantKeys.admin.detail(id) })
      qc.invalidateQueries({ queryKey: restaurantKeys.detail(id) })
      qc.invalidateQueries({ queryKey: restaurantKeys.admin.lists() })
      qc.invalidateQueries({ queryKey: restaurantKeys.lists() })
    },
  })
}

export const useDeleteBranch = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteBranch(id),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: restaurantKeys.admin.all })
      qc.invalidateQueries({ queryKey: restaurantKeys.lists() })
    },
  })
}

export const useUploadBranchPhoto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      uploadBranchPhoto(id, file),
    onSettled: (_d, _e, { id }) => {
      qc.invalidateQueries({ queryKey: restaurantKeys.admin.detail(id) })
      qc.invalidateQueries({ queryKey: restaurantKeys.detail(id) })
    },
  })
}

export const useDeleteBranchPhoto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, photoId }: { id: number; photoId: number }) =>
      deleteBranchPhoto(id, photoId),
    onSettled: (_d, _e, { id }) => {
      qc.invalidateQueries({ queryKey: restaurantKeys.admin.detail(id) })
      qc.invalidateQueries({ queryKey: restaurantKeys.detail(id) })
    },
  })
}

export const useUpdateBranchSchedules = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      schedules,
    }: {
      id: number
      schedules: ScheduleItemRequest[]
    }) => updateBranchSchedules(id, schedules),
    onSettled: (_d, _e, { id }) => {
      qc.invalidateQueries({ queryKey: restaurantKeys.admin.detail(id) })
      qc.invalidateQueries({ queryKey: restaurantKeys.detail(id) })
    },
  })
}
