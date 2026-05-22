import type { CuisineFilters } from "../schemas"

export const cuisineKeys = {
  all: ["cuisine"] as const,
  lists: () => [...cuisineKeys.all, "list"] as const,
  list: (filters?: CuisineFilters) =>
    [...cuisineKeys.lists(), filters ?? {}] as const,
  admin: {
    all: ["cuisine", "admin"] as const,
    lists: () => [...cuisineKeys.admin.all, "list"] as const,
  },
} as const
