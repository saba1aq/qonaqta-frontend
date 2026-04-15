import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { City, BranchList, BranchDetail, Cuisine } from '../model/types'

export function useCities() {
  return useQuery<City[]>({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data } = await apiClient.get<City[]>('/cities')
      return data
    },
  })
}

export function useCuisines() {
  return useQuery<Cuisine[]>({
    queryKey: ['cuisines'],
    queryFn: async () => {
      const { data } = await apiClient.get<Cuisine[]>('/cuisines', { params: { is_active: true } })
      return data
    },
  })
}

export function useBranches(cityId?: number, query?: string, cuisineIds?: number[]) {
  return useQuery<BranchList[]>({
    queryKey: ['branches', cityId, query, cuisineIds],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (cityId) params.set('city_id', String(cityId))
      if (query) params.set('q', query)
      if (cuisineIds?.length) cuisineIds.forEach(id => params.append('cuisine_id', String(id)))
      const { data } = await apiClient.get<BranchList[]>(`/restaurants?${params.toString()}`)
      return data
    },
  })
}

export function useBranchDetail(slug: string) {
  return useQuery<BranchDetail>({
    queryKey: ['branch', slug],
    queryFn: async () => {
      const { data } = await apiClient.get<BranchDetail>(`/restaurants/${slug}`)
      return data
    },
    enabled: !!slug,
  })
}
