export interface Branch {
  id: number
  brand_id: number
  name: string
  address: string
  city_id: number | null
  phone: string | null
  cuisine_ids: number[]
  is_active: boolean
  created_at: string
}

export interface CreateBranchPayload {
  name: string
  address: string
  city_id: number | null
  phone: string | null
  cuisine_ids: number[]
}

export interface UpdateBranchPayload {
  name?: string
  address?: string
  city_id?: number | null
  phone?: string | null
  cuisine_ids?: number[]
  is_active?: boolean
}
