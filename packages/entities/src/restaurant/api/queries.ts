import { queryOptions } from "@tanstack/react-query"
import { FIVE_MINUTES, ONE_MINUTE, TEN_MINUTES } from "../../shared/time"
import { restaurantKeys } from "./keys"
import {
  getAdminBranchDetail,
  getAdminBranchList,
  getBranchDetail,
  getBranchList,
  getBranchSlots,
} from "./services"
import type { BranchFilters } from "../schemas"

export const branchListQueryOptions = (filters?: BranchFilters) =>
  queryOptions({
    queryKey: restaurantKeys.list(filters),
    queryFn: () => getBranchList(filters),
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
  })

export const branchDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: restaurantKeys.detail(id),
    queryFn: () => getBranchDetail(id),
    enabled: !!id && !isNaN(id),
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
  })

export const branchSlotsQueryOptions = (id: number, date: string) =>
  queryOptions({
    queryKey: restaurantKeys.slots(id, date),
    queryFn: () => getBranchSlots(id, date),
    enabled: !!id && !!date,
    staleTime: ONE_MINUTE,
    gcTime: FIVE_MINUTES,
  })

export const adminBranchListQueryOptions = () =>
  queryOptions({
    queryKey: restaurantKeys.admin.lists(),
    queryFn: getAdminBranchList,
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
  })

export const adminBranchDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: restaurantKeys.admin.detail(id),
    queryFn: () => getAdminBranchDetail(id),
    enabled: !!id && !isNaN(id),
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
  })
