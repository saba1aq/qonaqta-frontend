export interface Restaurant {
  id: number
  city_id: number
  city: { id: number; name: string } | null
  name: string
  address: string
  phone: string | null
  description: string | null
  instagram: string | null
  telegram: string | null
  tiktok: string | null
  whatsapp: string | null
  website: string | null
  two_gis: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RestaurantDetail extends Restaurant {
  cuisines: Cuisine[]
  photos: Photo[]
  schedules: Schedule[]
  city: { id: number; name: string; slug: string }
}

export interface Photo {
  id: number
  branch_id: number
  image_url: string
  sort_order: number
}

export interface Schedule {
  id: number
  branch_id: number
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}

export interface Cuisine {
  id: number
  name: string
  slug: string
  is_active: boolean
}

export interface City {
  id: number
  name: string
  slug: string
}

export interface CreateRestaurantPayload {
  name: string
  city_id: number
  address?: string
  phone?: string
  description?: string
  cuisine_ids?: number[]
}

export interface UpdateRestaurantPayload {
  name?: string
  city_id?: number
  address?: string
  phone?: string
  description?: string
  instagram?: string
  telegram?: string
  tiktok?: string
  whatsapp?: string
  website?: string
  two_gis?: string
  is_active?: boolean
  cuisine_ids?: number[]
}
