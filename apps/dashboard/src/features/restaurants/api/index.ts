import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiClient } from "@/shared/api"
import type { Restaurant } from "../model/types"

const QUERY_KEY = ["hub-restaurants"]

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
      const { data } = await apiClient.post("/admin/restaurants", body)
      return data as Restaurant
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success("Бренд создан")
      onSuccess()
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { detail?: { error?: { message?: string } } } } })
        ?.response?.data?.detail?.error?.message
      toast.error(msg ?? "Ошибка при создании")
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
