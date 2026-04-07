export type City = {
  id: string
  name: string
  slug: string
  is_active: boolean
  sort_order: number
}

export type CreateCityPayload = {
  name: string
  slug: string
  sort_order?: number
}

export type UpdateCityPayload = {
  name?: string
  slug?: string
  sort_order?: number
  is_active?: boolean
}
