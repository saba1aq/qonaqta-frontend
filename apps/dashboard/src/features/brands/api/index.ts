import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiClient } from "@/shared/api"
import type { Brand, CreateBrandPayload, UpdateBrandPayload } from "../model/types"

const LIST_KEY = ["hub-brands"]
const DETAIL_KEY = (id: number) => ["hub-brand", id]

export function useBrands() {
  return useQuery<Brand[]>({
    queryKey: LIST_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get("/brands")
      return data
    },
  })
}

export function useBrand(id: number | undefined) {
  return useQuery<Brand>({
    queryKey: DETAIL_KEY(id ?? 0),
    queryFn: async () => {
      const { data } = await apiClient.get(`/brands/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateBrand(onSuccess: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: CreateBrandPayload) => {
      const { data } = await apiClient.post("/brands", body)
      return data as Brand
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY })
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

export function useUpdateBrand(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateBrandPayload }) => {
      const { data } = await apiClient.patch(`/brands/${id}`, payload)
      return data as Brand
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY })
      queryClient.invalidateQueries({ queryKey: DETAIL_KEY(variables.id) })
      toast.success("Бренд обновлён")
      onSuccess?.()
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

export function useDeleteBrand() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/admin/restaurants/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY })
      toast.success("Бренд удалён")
    },
    onError: () => {
      toast.error("Ошибка при удалении")
    },
  })
}
