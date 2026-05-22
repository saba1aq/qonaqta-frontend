import { useMutation, useQueryClient } from "@tanstack/react-query"
import { featureKeys } from "./keys"
import { createFeature, deleteFeature, updateFeature } from "./services"
import type {
  CreateFeatureRequest,
  UpdateFeatureRequest,
} from "../schemas"

export const useCreateFeature = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateFeatureRequest) => createFeature(data),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: featureKeys.all })
    },
  })
}

export const useUpdateFeature = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFeatureRequest }) =>
      updateFeature(id, data),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: featureKeys.all })
    },
  })
}

export const useDeleteFeature = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteFeature(id),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: featureKeys.all })
    },
  })
}
