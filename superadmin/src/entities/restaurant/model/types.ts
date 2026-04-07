export type Restaurant = {
  id: string
  name: string
  slug: string
  description: string | null
  is_active: boolean
  is_deleted: boolean
}

export type Branch = {
  id: string
  name: string
  slug: string
  city_id: string
  address: string
  is_active: boolean
}

export type UpdateRestaurantPayload = {
  name?: string
  description?: string
  is_active?: boolean
}

export type UpdateBranchPayload = {
  name?: string
  address?: string
  is_active?: boolean
}
