import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiClient } from "@/shared/api"
import type { Feature, CreateFeaturePayload, UpdateFeaturePayload } from "../model/types"

const QUERY_KEY = ["hub-features"]

export function useFeatures() {
  return useQuery<Feature[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/admin/features")
      return data
    },
  })
}

export function useCreateFeature(onSuccess: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: CreateFeaturePayload) => {
      const { data } = await apiClient.post("/api/v1/admin/features", body)
      return data as Feature
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success("Особенность добавлена")
      onSuccess()
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 409) {
        toast.error("Особенность с таким slug уже существует")
      } else {
        toast.error("Ошибка при создании")
      }
    },
  })
}

export function useUpdateFeature(onSuccess: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateFeaturePayload }) => {
      const { data } = await apiClient.patch(`/api/v1/admin/features/${id}`, payload)
      return data as Feature
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success("Особенность обновлена")
      onSuccess()
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 409) {
        toast.error("Особенность с таким slug уже существует")
      } else if (status === 404) {
        toast.error("Особенность не найдена")
      } else {
        toast.error("Ошибка при обновлении")
      }
    },
  })
}

export function useToggleFeatureActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
      const { data } = await apiClient.patch(`/api/v1/admin/features/${id}`, { is_active })
      return data as Feature
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: () => {
      toast.error("Ошибка при обновлении")
    },
  })
}

export function useDeleteFeature() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/api/v1/admin/features/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success("Особенность удалена")
    },
    onError: () => {
      toast.error("Ошибка при удалении")
    },
  })
}
