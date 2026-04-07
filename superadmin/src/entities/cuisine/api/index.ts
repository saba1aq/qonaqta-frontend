import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/api"
import type { Cuisine, CreateCuisinePayload, UpdateCuisinePayload } from "../model/types"

export function useCuisines() {
  return useQuery({
    queryKey: ["cuisines"],
    queryFn: async () => {
      const { data } = await apiClient.get("/cuisines")
      return data as Cuisine[]
    },
  })
}

export function useCreateCuisine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCuisinePayload) =>
      apiClient.post("/admin/cuisines", payload).then((r) => r.data as Cuisine),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cuisines"] }),
  })
}

export function useUpdateCuisine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateCuisinePayload & { id: string }) =>
      apiClient.put(`/admin/cuisines/${id}`, payload).then((r) => r.data as Cuisine),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cuisines"] }),
  })
}

export function useDeleteCuisine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/cuisines/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cuisines"] }),
  })
}
