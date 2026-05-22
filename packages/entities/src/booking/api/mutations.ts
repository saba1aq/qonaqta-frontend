import { useMutation, useQueryClient } from "@tanstack/react-query"
import { bookingKeys } from "./keys"
import { createBooking, updateBookingStatus } from "./services"
import type {
  CreateBookingRequest,
  UpdateBookingStatusRequest,
} from "../schemas"

export const useCreateBooking = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBookingRequest) => createBooking(data),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: bookingKeys.all })
    },
  })
}

export const useUpdateBookingStatus = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateBookingStatusRequest
    }) => updateBookingStatus(id, data),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: bookingKeys.admin.all })
    },
  })
}
