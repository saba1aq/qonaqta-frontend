import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiClient } from "@/shared/api"
import type {
  Promotion,
  PromotionFilters,
  CreatePromotionPayload,
  UpdatePromotionPayload,
} from "../model/types"

const LIST_KEY = ["hub-promotions"]
const QUERY_KEY = (filters: PromotionFilters) => [...LIST_KEY, filters]

export function usePromotions(filters: PromotionFilters) {
  return useQuery<Promotion[]>({
    queryKey: QUERY_KEY(filters),
    queryFn: async () => {
      const params: Record<string, string | number> = {}
      if (filters.branch_id) params.branch_id = filters.branch_id
      if (filters.skip !== undefined) params.skip = filters.skip
      if (filters.limit !== undefined) params.limit = filters.limit
      const { data } = await apiClient.get("/api/v1/admin/promotions", { params })
      return data
    },
  })
}

export function useCreatePromotion(onSuccess: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: CreatePromotionPayload) => {
      const { data } = await apiClient.post("/api/v1/admin/promotions", body)
      return data as Promotion
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY })
      toast.success("Промо добавлено")
      onSuccess()
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 404) {
        toast.error("Заведение не найдено")
      } else if (status === 422) {
        toast.error("Проверьте заполненные поля")
      } else {
        toast.error("Ошибка при создании")
      }
    },
  })
}

export function useUpdatePromotion(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdatePromotionPayload }) => {
      const { data } = await apiClient.patch(`/api/v1/admin/promotions/${id}`, payload)
      return data as Promotion
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY })
      toast.success("Промо обновлено")
      onSuccess?.()
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 404) {
        toast.error("Промо не найдено")
      } else if (status === 422) {
        toast.error("Проверьте заполненные поля")
      } else {
        toast.error("Ошибка при обновлении")
      }
    },
  })
}

export function useDeletePromotion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/api/v1/admin/promotions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY })
      toast.success("Промо удалено")
    },
    onError: () => {
      toast.error("Ошибка при удалении")
    },
  })
}
