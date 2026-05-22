import type { FeatureFilters } from "../schemas"

export const featureKeys = {
  all: ["feature"] as const,
  lists: () => [...featureKeys.all, "list"] as const,
  list: (filters?: FeatureFilters) =>
    [...featureKeys.lists(), filters ?? {}] as const,
  admin: {
    all: ["feature", "admin"] as const,
    lists: () => [...featureKeys.admin.all, "list"] as const,
  },
} as const
