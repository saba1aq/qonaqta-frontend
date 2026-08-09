import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { Promotion } from '../model/types'

export function usePromotions(cityId?: number) {
  return useQuery<Promotion[]>({
    queryKey: ['promotions', cityId],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (cityId) params.set('city_id', String(cityId))
      const { data } = await apiClient.get<Promotion[]>(`/api/v1/promotions?${params.toString()}`)
      return data
    },
    retry: false,
  })
}
