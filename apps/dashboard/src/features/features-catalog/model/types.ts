export interface Feature {
  id: number
  name: string
  slug: string
  icon: string
  is_active: boolean
}

export interface CreateFeaturePayload {
  name: string
  slug: string
  icon?: string
}

export interface UpdateFeaturePayload {
  name?: string
  slug?: string
  icon?: string
  is_active?: boolean
}
