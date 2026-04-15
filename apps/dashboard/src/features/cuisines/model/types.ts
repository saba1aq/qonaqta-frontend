export interface Cuisine {
  id: number
  name: string
  slug: string
  is_active: boolean
}

export interface UpdateCuisinePayload {
  name?: string
  slug?: string
  is_active?: boolean
}
