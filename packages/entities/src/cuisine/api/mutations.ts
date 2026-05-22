import { useMutation, useQueryClient } from "@tanstack/react-query"
import { cuisineKeys } from "./keys"
import { createCuisine, deleteCuisine, updateCuisine } from "./services"
import type {
  CreateCuisineRequest,
  UpdateCuisineRequest,
} from "../schemas"

export const useCreateCuisine = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCuisineRequest) => createCuisine(data),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: cuisineKeys.all })
    },
  })
}

export const useUpdateCuisine = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCuisineRequest }) =>
      updateCuisine(id, data),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: cuisineKeys.all })
    },
  })
}

export const useDeleteCuisine = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCuisine(id),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: cuisineKeys.all })
    },
  })
}
