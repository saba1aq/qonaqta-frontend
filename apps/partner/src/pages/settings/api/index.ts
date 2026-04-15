import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiClient } from "@/shared/api"
import type { ContactsData, ProfileData, WorkingHoursData } from "../model/types"
import { DAYS_ORDER } from "../model/constants"
import type { BranchData } from "../lib/mappers"

async function fetchBranchContext() {
  const { data: restaurants } = await apiClient.get("/admin/restaurants")
  const restaurant = restaurants[0]
  if (!restaurant) return { branchId: null, restaurantId: null }
  const { data: branches } = await apiClient.get("/admin/branches")
  const branch = branches.find((b: { restaurant_id: number }) => b.restaurant_id === restaurant.id)
  return { branchId: branch?.id ?? null, restaurantId: restaurant.id }
}

export function useBranchContext() {
  return useQuery({
    queryKey: ["admin-context"],
    queryFn: fetchBranchContext,
    staleTime: Infinity,
  })
}

export function useBranchData(branchId: number | null | undefined) {
  return useQuery({
    queryKey: ["admin-branch", branchId],
    queryFn: async () => {
      const { data } = await apiClient.get<BranchData>(`/admin/branches/${branchId}`)
      return data
    },
    enabled: !!branchId,
  })
}

export function useSaveSettings(
  branchId: number | null | undefined,
  getPayload: () => {
    profile: ProfileData
    contacts: ContactsData
    workingHours: WorkingHoursData
    pendingFiles: File[]
    deletedPhotoIds: number[]
  },
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (!branchId) return
      const { profile, contacts, workingHours, pendingFiles, deletedPhotoIds } = getPayload()

      await apiClient.put(`/admin/branches/${branchId}`, {
        name: profile.name,
        description: profile.description,
        address: profile.address,
        phone: contacts.phone,
        instagram: contacts.instagram,
        tiktok: contacts.tiktok,
        whatsapp: contacts.whatsapp,
        website: profile.socialWebsite,
        two_gis: profile.social2gis,
      })

      for (const photoId of deletedPhotoIds) {
        await apiClient.delete(`/admin/branches/${branchId}/photos/${photoId}`)
      }

      for (const file of pendingFiles) {
        const formData = new FormData()
        formData.append("file", file)
        await apiClient.post(`/admin/branches/${branchId}/photos`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      const schedules = DAYS_ORDER.map((day, i) => {
        if (workingHours.sameForAll) {
          return {
            day_of_week: i,
            open_time: workingHours.allDays.open,
            close_time: workingHours.allDays.close,
            is_closed: false,
          }
        }
        const s = workingHours.days[day]
        return {
          day_of_week: i,
          open_time: s.open,
          close_time: s.close,
          is_closed: !s.enabled,
        }
      })
      await apiClient.put(`/admin/branches/${branchId}/schedules`, { schedules })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-branch", branchId] })
      toast.success("Настройки сохранены")
    },
    onError: () => {
      toast.error("Ошибка при сохранении")
    },
  })
}
