import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiClient } from "@/shared/api"
import type { Restaurant } from "../model/types"

const QUERY_KEY = ["hub-restaurants"]

export interface UpdateBrandPayload {
  name?: string
  slug?: string
  description?: string | null
}

export function useRestaurants() {
  return useQuery<Restaurant[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/restaurants")
      return data
    },
  })
}

export function useCreateRestaurant(onSuccess: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: { name: string; slug: string; description: string | null }) => {
      const { data } = await apiClient.post("/brands", body)
      return data as Restaurant
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success("Бренд создан")
      onSuccess()
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status
      const msg = (err as { response?: { data?: { detail?: { error?: { message?: string } } } } })
        ?.response?.data?.detail?.error?.message
      if (status === 409) {
        toast.error("Бренд с таким slug уже существует")
      } else {
        toast.error(msg ?? "Ошибка при создании")
      }
    },
  })
}

export function useUpdateRestaurant(onSuccess: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateBrandPayload }) => {
      const { data } = await apiClient.patch(`/brands/${id}`, payload)
      return data as Restaurant
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success("Бренд обновлён")
      onSuccess()
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 409) {
        toast.error("Бренд с таким slug уже существует")
      } else if (status === 404) {
        toast.error("Бренд не найден")
      } else {
        toast.error("Ошибка при обновлении")
      }
    },
  })
}

export function useDeleteRestaurant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/admin/restaurants/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success("Бренд удалён")
    },
  })
}
