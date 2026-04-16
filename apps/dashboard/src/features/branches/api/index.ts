import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { Branch, CreateBranchPayload, UpdateBranchPayload } from "../model/types"
import { mockBranches, nextBranchId } from "../mocks/store"

const DELAY = 200
const LIST_KEY = (brandId: number) => ["mock-branches", brandId]

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY))
}

export function useBranchesByBrand(brandId: number | undefined) {
  return useQuery<Branch[]>({
    queryKey: LIST_KEY(brandId ?? 0),
    queryFn: async () => {
      return delay(mockBranches.filter((b) => b.brand_id === brandId))
    },
    enabled: !!brandId,
  })
}

export function useCreateBranch(brandId: number, onSuccess: () => void) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateBranchPayload) => {
      const branch: Branch = {
        id: nextBranchId(),
        brand_id: brandId,
        is_active: true,
        created_at: new Date().toISOString(),
        ...payload,
      }
      mockBranches.push(branch)
      return delay(branch)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LIST_KEY(brandId) })
      toast.success("Филиал добавлен")
      onSuccess()
    },
  })
}

export function useUpdateBranch(brandId: number, onSuccess?: () => void) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateBranchPayload }) => {
      const idx = mockBranches.findIndex((b) => b.id === id)
      if (idx === -1) throw new Error("Branch not found")
      mockBranches[idx] = { ...mockBranches[idx], ...payload }
      return delay(mockBranches[idx])
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LIST_KEY(brandId) })
      toast.success("Филиал обновлён")
      onSuccess?.()
    },
  })
}

export function useDeleteBranch(brandId: number) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const idx = mockBranches.findIndex((b) => b.id === id)
      if (idx !== -1) mockBranches.splice(idx, 1)
      return delay(true)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LIST_KEY(brandId) })
      toast.success("Филиал удалён")
    },
  })
}
