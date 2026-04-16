import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { Staff, CreateStaffPayload, UpdateStaffPayload } from "../model/types"
import { mockStaff, nextStaffId } from "../mocks/store"

const DELAY = 200
const LIST_KEY = (brandId: number) => ["mock-staff", brandId]

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY))
}

export function useStaffByBrand(brandId: number | undefined) {
  return useQuery<Staff[]>({
    queryKey: LIST_KEY(brandId ?? 0),
    queryFn: async () => {
      return delay(mockStaff.filter((s) => s.brand_id === brandId))
    },
    enabled: !!brandId,
  })
}

export function useCreateStaff(brandId: number, onSuccess: () => void) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateStaffPayload) => {
      const exists = mockStaff.some((s) => s.phone === payload.phone)
      if (exists) {
        throw new Error("phone_exists")
      }
      const { password: _password, ...rest } = payload
      void _password
      const staff: Staff = {
        id: nextStaffId(),
        brand_id: brandId,
        is_active: true,
        created_at: new Date().toISOString(),
        ...rest,
      }
      mockStaff.push(staff)
      return delay(staff)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LIST_KEY(brandId) })
      toast.success("Админ добавлен")
      onSuccess()
    },
    onError: (err: Error) => {
      if (err.message === "phone_exists") {
        toast.error("Пользователь с таким телефоном уже существует")
      } else {
        toast.error("Ошибка при создании")
      }
    },
  })
}

export function useUpdateStaff(brandId: number, onSuccess?: () => void) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateStaffPayload }) => {
      const idx = mockStaff.findIndex((s) => s.id === id)
      if (idx === -1) throw new Error("Staff not found")
      mockStaff[idx] = { ...mockStaff[idx], ...payload }
      return delay(mockStaff[idx])
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LIST_KEY(brandId) })
      toast.success("Админ обновлён")
      onSuccess?.()
    },
  })
}

export function useDeleteStaff(brandId: number) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const idx = mockStaff.findIndex((s) => s.id === id)
      if (idx !== -1) mockStaff.splice(idx, 1)
      return delay(true)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LIST_KEY(brandId) })
      toast.success("Админ удалён")
    },
  })
}
