export interface City {
  id: number
  name: string
  slug: string
  country: string
}

export interface Cuisine {
  id: number
  name: string
  slug: string
}

export interface BranchPhoto {
  id: number
  image_url: string
  sort_order: number
}

export interface BranchList {
  id: number
  name: string
  address: string
  cuisines: Cuisine[]
  photos: BranchPhoto[]
}

export interface BranchSchedule {
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}

export interface BranchStatus {
  state: 'open' | 'closing_soon' | 'closed'
  closes_in_minutes: number | null
  open_until: string | null
  opens_at: string | null
  opens_in_days: number | null
}

export interface BranchDetail extends BranchList {
  phone: string | null
  description: string | null
  instagram: string | null
  telegram: string | null
  tiktok: string | null
  whatsapp: string | null
  website: string | null
  two_gis: string | null
  is_active: boolean
  schedules: BranchSchedule[]
  city: { id: number; name: string; slug: string }
  status: BranchStatus | null
}
