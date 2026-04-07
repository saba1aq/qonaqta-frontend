import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/api"
import type { City, CreateCityPayload, UpdateCityPayload } from "../model/types"

export function useCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const { data } = await apiClient.get("/cities")
      return data as City[]
    },
  })
}

export function useCreateCity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCityPayload) =>
      apiClient.post("/admin/cities", payload).then((r) => r.data as City),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cities"] }),
  })
}

export function useUpdateCity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateCityPayload & { id: string }) =>
      apiClient.put(`/admin/cities/${id}`, payload).then((r) => r.data as City),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cities"] }),
  })
}

export function useDeleteCity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/cities/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cities"] }),
  })
}
