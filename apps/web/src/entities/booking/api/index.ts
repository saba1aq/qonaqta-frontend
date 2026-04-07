import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { Booking, CreateBookingRequest } from '../model/types'

export function useMyBookings() {
  return useQuery<Booking[]>({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const { data } = await apiClient.get<Booking[]>('/bookings/me')
      return data
    },
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()
  return useMutation<Booking, Error, CreateBookingRequest>({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post<Booking>('/bookings', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] })
    },
  })
}

export function useCancelBooking() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: async (bookingId) => {
      await apiClient.delete(`/bookings/${bookingId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] })
    },
  })
}
