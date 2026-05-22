import { queryOptions } from "@tanstack/react-query"
import { ONE_HOUR, THIRTY_MINUTES } from "../../shared/time"
import { cityKeys } from "./keys"
import { getCities } from "./services"

export const cityListQueryOptions = () =>
  queryOptions({
    queryKey: cityKeys.lists(),
    queryFn: getCities,
    staleTime: THIRTY_MINUTES,
    gcTime: ONE_HOUR,
  })
