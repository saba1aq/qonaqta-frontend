import { queryOptions } from "@tanstack/react-query"
import { FIVE_MINUTES, TEN_MINUTES } from "../../shared/time"
import { authKeys } from "./keys"
import { getMe } from "./services"

export const meQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.me(),
    queryFn: getMe,
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
  })
