import type { BookingFilters } from "../schemas"

export const bookingKeys = {
  all: ["booking"] as const,
  admin: {
    all: ["booking", "admin"] as const,
    lists: () => [...bookingKeys.admin.all, "list"] as const,
    list: (filters?: BookingFilters) =>
      [...bookingKeys.admin.lists(), filters ?? {}] as const,
  },
} as const
