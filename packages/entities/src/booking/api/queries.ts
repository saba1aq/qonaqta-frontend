import { queryOptions } from "@tanstack/react-query"
import { FIVE_MINUTES, ONE_MINUTE } from "../../shared/time"
import { bookingKeys } from "./keys"
import { getAdminBookings } from "./services"
import type { BookingFilters } from "../schemas"

export const adminBookingListQueryOptions = (filters?: BookingFilters) =>
  queryOptions({
    queryKey: bookingKeys.admin.list(filters),
    queryFn: () => getAdminBookings(filters),
    staleTime: ONE_MINUTE,
    gcTime: FIVE_MINUTES,
  })
