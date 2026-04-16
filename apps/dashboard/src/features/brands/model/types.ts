export interface Brand {
  id: number
  name: string
  slug: string
  description: string | null
  is_active: boolean
  created_at: string
}

export interface CreateBrandPayload {
  name: string
  slug: string
  description: string | null
}

export interface UpdateBrandPayload {
  name?: string
  slug?: string
  description?: string | null
  is_active?: boolean
}
