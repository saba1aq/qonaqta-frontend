import { queryOptions } from "@tanstack/react-query"
import { FIVE_MINUTES, ONE_HOUR, THIRTY_MINUTES } from "../../shared/time"
import { cuisineKeys } from "./keys"
import { getAdminCuisines, getCuisines } from "./services"
import type { CuisineFilters } from "../schemas"

export const cuisineListQueryOptions = (filters?: CuisineFilters) =>
  queryOptions({
    queryKey: cuisineKeys.list(filters),
    queryFn: () => getCuisines(filters),
    staleTime: THIRTY_MINUTES,
    gcTime: ONE_HOUR,
  })

export const adminCuisineListQueryOptions = () =>
  queryOptions({
    queryKey: cuisineKeys.admin.lists(),
    queryFn: getAdminCuisines,
    staleTime: FIVE_MINUTES,
    gcTime: ONE_HOUR,
  })
