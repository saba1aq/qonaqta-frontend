import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiClient } from "@/shared/api"
import type { Cuisine, UpdateCuisinePayload } from "../model/types"

const QUERY_KEY = ["hub-cuisines"]

export function useCuisines() {
  return useQuery<Cuisine[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get("/cuisines")
      return data
    },
  })
}

export function useCreateCuisine(onSuccess: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: { name: string; slug: string }) => {
      const { data } = await apiClient.post("/cuisines", body)
      return data as Cuisine
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success("Кухня добавлена")
      onSuccess()
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 409) {
        toast.error("Кухня с таким slug уже существует")
      } else {
        toast.error("Ошибка при создании")
      }
    },
  })
}

export function useUpdateCuisine(onSuccess: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateCuisinePayload }) => {
      const { data } = await apiClient.patch(`/cuisines/${id}`, payload)
      return data as Cuisine
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success("Кухня обновлена")
      onSuccess()
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 409) {
        toast.error("Кухня с таким slug уже существует")
      } else if (status === 404) {
        toast.error("Кухня не найдена")
      } else {
        toast.error("Ошибка при обновлении")
      }
    },
  })
}

export function useToggleCuisineActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
      const { data } = await apiClient.patch(`/cuisines/${id}`, { is_active })
      return data as Cuisine
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: () => {
      toast.error("Ошибка при обновлении")
    },
  })
}

export function useDeleteCuisine() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/cuisines/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success("Кухня удалена")
    },
    onError: () => {
      toast.error("Ошибка при удалении")
    },
  })
}
