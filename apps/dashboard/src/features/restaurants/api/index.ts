import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiClient } from "@/shared/api"
import type {
  Restaurant,
  RestaurantDetail,
  CreateRestaurantPayload,
  UpdateRestaurantPayload,
  City,
  Schedule,
} from "../model/types"

const LIST_KEY = ["hub-restaurants"]
const DETAIL_KEY = (id: number) => ["hub-restaurant", id]
const CITIES_KEY = ["cities"]

export function useRestaurants() {
  return useQuery<Restaurant[]>({
    queryKey: LIST_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/admin/restaurants")
      return data
    },
  })
}

export function useRestaurant(id: number | undefined) {
  return useQuery<RestaurantDetail>({
    queryKey: DETAIL_KEY(id ?? 0),
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/v1/admin/restaurants/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateRestaurant(onSuccess: (restaurant: Restaurant) => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: CreateRestaurantPayload) => {
      const { data } = await apiClient.post("/api/v1/admin/restaurants", body)
      return data as Restaurant
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY })
      toast.success("Ресторан создан")
      onSuccess(data)
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 409) {
        toast.error("Ресторан уже существует")
      } else {
        toast.error("Ошибка при создании")
      }
    },
  })
}

export function useUpdateRestaurant(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateRestaurantPayload }) => {
      const { data } = await apiClient.patch(`/api/v1/admin/restaurants/${id}`, payload)
      return data as Restaurant
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY })
      queryClient.invalidateQueries({ queryKey: DETAIL_KEY(variables.id) })
      toast.success("Ресторан обновлён")
      onSuccess?.()
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 404) {
        toast.error("Ресторан не найден")
      } else {
        toast.error("Ошибка при обновлении")
      }
    },
  })
}

export function useDeleteRestaurant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/api/v1/admin/restaurants/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY })
      toast.success("Ресторан удалён")
    },
    onError: () => {
      toast.error("Ошибка при удалении")
    },
  })
}

export function useUploadPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, files }: { id: number; files: File[] }) => {
      const results = []
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)
        const { data } = await apiClient.post(`/api/v1/admin/restaurants/${id}/photos`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        results.push(data)
      }
      return results
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DETAIL_KEY(variables.id) })
      toast.success("Фото загружено")
    },
    onError: () => {
      toast.error("Ошибка при загрузке фото")
    },
  })
}

export function useDeletePhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ restaurantId, photoId }: { restaurantId: number; photoId: number }) => {
      await apiClient.delete(`/api/v1/admin/restaurants/${restaurantId}/photos/${photoId}`)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DETAIL_KEY(variables.restaurantId) })
      toast.success("Фото удалено")
    },
    onError: () => {
      toast.error("Ошибка при удалении фото")
    },
  })
}

export function useUpdateSchedules() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, schedules }: { id: number; schedules: Omit<Schedule, "id" | "branch_id">[] }) => {
      const { data } = await apiClient.put(`/api/v1/admin/restaurants/${id}/schedules`, schedules)
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DETAIL_KEY(variables.id) })
      toast.success("Расписание сохранено")
    },
    onError: () => {
      toast.error("Ошибка при сохранении расписания")
    },
  })
}

export function useCities() {
  return useQuery<City[]>({
    queryKey: CITIES_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/cities")
      return data
    },
  })
}
