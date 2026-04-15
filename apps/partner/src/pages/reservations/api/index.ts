import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/api"
import type { ApiBooking } from "../lib/mappers"
import { formatApiDate } from "../lib/date-utils"

async function fetchAdminContext() {
  const { data: restaurants } = await apiClient.get("/admin/restaurants")
  const restaurant = restaurants[0]
  if (!restaurant) return { branchId: null }
  const { data: branches } = await apiClient.get(`/admin/restaurants/${restaurant.id}/branches`)
  return { branchId: branches[0]?.id ?? null }
}

export function useAdminContext() {
  return useQuery({
    queryKey: ["admin-context"],
    queryFn: fetchAdminContext,
    staleTime: Infinity,
  })
}

export function useBookings(branchId: number | null | undefined, date: Date) {
  return useQuery({
    queryKey: ["bookings", branchId, formatApiDate(date)],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/bookings", {
        params: { branch_id: branchId, date: formatApiDate(date) },
      })
      return data as ApiBooking[]
    },
    enabled: !!branchId,
  })
}

export function useBookingActions() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["bookings"] })
  }

  const confirmMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/admin/bookings/${id}/confirm`),
    onSuccess: invalidate,
  })

  const cancelMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/admin/bookings/${id}/cancel`),
    onSuccess: invalidate,
  })

  const noShowMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/admin/bookings/${id}/no-show`),
    onSuccess: invalidate,
  })

  const completeMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/admin/bookings/${id}/complete`),
    onSuccess: invalidate,
  })

  return { confirmMutation, cancelMutation, noShowMutation, completeMutation }
}
