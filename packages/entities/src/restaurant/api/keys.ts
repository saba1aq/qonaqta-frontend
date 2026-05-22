import type { BranchFilters } from "../schemas"

export const restaurantKeys = {
  all: ["restaurant"] as const,
  lists: () => [...restaurantKeys.all, "list"] as const,
  list: (filters?: BranchFilters) =>
    [...restaurantKeys.lists(), filters ?? {}] as const,
  details: () => [...restaurantKeys.all, "detail"] as const,
  detail: (id: number) => [...restaurantKeys.details(), id] as const,
  slots: (id: number, date: string) =>
    [...restaurantKeys.all, "slots", id, date] as const,
  admin: {
    all: ["restaurant", "admin"] as const,
    lists: () => [...restaurantKeys.admin.all, "list"] as const,
    details: () => [...restaurantKeys.admin.all, "detail"] as const,
    detail: (id: number) => [...restaurantKeys.admin.details(), id] as const,
  },
} as const
