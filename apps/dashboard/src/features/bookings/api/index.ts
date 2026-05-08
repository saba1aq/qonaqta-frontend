import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiClient } from "@/shared/api"
import type { Booking, BookingStatus } from "../model/types"

interface BookingFilters {
  branch_id?: number
  date?: string
  status?: BookingStatus
  skip?: number
  limit?: number
}

const QUERY_KEY = (filters: BookingFilters) => ["admin-bookings", filters]

export function useAdminBookings(filters: BookingFilters) {
  return useQuery<Booking[]>({
    queryKey: QUERY_KEY(filters),
    queryFn: async () => {
      const params: Record<string, string | number> = {}
      if (filters.branch_id) params.branch_id = filters.branch_id
      if (filters.date) params.date = filters.date
      if (filters.status) params.status = filters.status
      if (filters.skip !== undefined) params.skip = filters.skip
      if (filters.limit !== undefined) params.limit = filters.limit
      const { data } = await apiClient.get("/api/v1/admin/bookings", { params })
      return data
    },
  })
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingStatus }) => {
      const { data } = await apiClient.patch(`/api/v1/admin/bookings/${id}/status`, { status })
      return data as Booking
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] })
      toast.success("Статус обновлён")
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 404) {
        toast.error("Бронь не найдена")
      } else {
        toast.error("Ошибка при обновлении статуса")
      }
    },
  })
}
