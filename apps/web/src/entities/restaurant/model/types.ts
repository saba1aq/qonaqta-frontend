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
  icon_url: string | null
}

export interface BranchPhoto {
  id: number
  image_url: string
  sort_order: number
}

export interface BranchList {
  id: number
  name: string
  slug: string
  address: string
  cover_image_url: string | null
  booking_enabled: boolean
  deposit_required: boolean
  default_deposit_amount: number | null
  cuisines: Cuisine[]
  photos: BranchPhoto[]
}

export interface BranchSchedule {
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}

export interface BranchDetail extends BranchList {
  phone: string | null
  description: string | null
  instagram: string | null
  telegram: string | null
  tiktok: string | null
  is_active: boolean
  schedules: BranchSchedule[]
  restaurant: { id: number; name: string; slug: string; logo_url: string | null }
  city: { id: number; name: string; slug: string }
}

export interface Table {
  id: number
  label: string
  seats: number
  x: number
  y: number
  width: number
  height: number
  shape: 'circle' | 'rectangle' | 'square'
  rotation: number
  is_active: boolean
  booking_enabled: boolean
  min_deposit: number | null
}

export interface FloorDecoration {
  id: number
  type: 'plant' | 'wc' | 'wall' | 'bar' | 'entrance' | 'stage'
  label: string | null
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

export interface Floor {
  id: number
  name: string
  sort_order: number
  tables: Table[]
  decorations: FloorDecoration[]
}

export interface MenuItem {
  id: number
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean
}

export interface MenuCategory {
  id: number
  name: string
  sort_order: number
  items: MenuItem[]
}
