import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/api"
import type { Restaurant, Branch, UpdateRestaurantPayload, UpdateBranchPayload } from "../model/types"

export function useRestaurants() {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/restaurants")
      return data as Restaurant[]
    },
  })
}

export function useRestaurantBranches(restaurantId: string | null) {
  return useQuery({
    queryKey: ["restaurant-branches", restaurantId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/admin/restaurants/${restaurantId}/branches`)
      return data as Branch[]
    },
    enabled: !!restaurantId,
  })
}

export function useUpdateRestaurant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateRestaurantPayload & { id: string }) =>
      apiClient.put(`/admin/restaurants/${id}`, payload).then((r) => r.data as Restaurant),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["restaurants"] }),
  })
}

export function useUpdateBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, restaurantId, ...payload }: UpdateBranchPayload & { id: string; restaurantId: string }) =>
      apiClient.put(`/admin/branches/${id}`, payload).then((r) => r.data as Branch),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-branches", variables.restaurantId] })
    },
  })
}
