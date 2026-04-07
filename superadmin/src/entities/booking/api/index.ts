import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/api"
import type { Booking } from "../model/types"

type BookingsFilter = {
  branch_id?: string
  date?: string
  status?: string
}

export function useBookings(filters: BookingsFilter = {}) {
  return useQuery({
    queryKey: ["bookings", filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.branch_id) params.set("branch_id", filters.branch_id)
      if (filters.date) params.set("date", filters.date)
      if (filters.status) params.set("status", filters.status)
      const query = params.toString()
      const { data } = await apiClient.get(`/admin/bookings${query ? `?${query}` : ""}`)
      return data as Booking[]
    },
  })
}

export function useConfirmBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.post(`/admin/bookings/${id}/confirm`).then((r) => r.data as Booking),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  })
}

export function useCancelBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.post(`/admin/bookings/${id}/cancel`).then((r) => r.data as Booking),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  })
}

export function useNoShowBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.post(`/admin/bookings/${id}/no-show`).then((r) => r.data as Booking),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  })
}

export function useCompleteBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.post(`/admin/bookings/${id}/complete`).then((r) => r.data as Booking),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  })
}
