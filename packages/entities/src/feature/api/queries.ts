import { queryOptions } from "@tanstack/react-query"
import { FIVE_MINUTES, ONE_HOUR, THIRTY_MINUTES } from "../../shared/time"
import { featureKeys } from "./keys"
import { getAdminFeatures, getFeatures } from "./services"
import type { FeatureFilters } from "../schemas"

export const featureListQueryOptions = (filters?: FeatureFilters) =>
  queryOptions({
    queryKey: featureKeys.list(filters),
    queryFn: () => getFeatures(filters),
    staleTime: THIRTY_MINUTES,
    gcTime: ONE_HOUR,
  })

export const adminFeatureListQueryOptions = () =>
  queryOptions({
    queryKey: featureKeys.admin.lists(),
    queryFn: getAdminFeatures,
    staleTime: FIVE_MINUTES,
    gcTime: ONE_HOUR,
  })
