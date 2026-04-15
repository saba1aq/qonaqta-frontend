export interface Branch {
  id: number
  name: string
  address: string
  is_active: boolean
}

export interface Restaurant {
  id: number
  name: string
  slug: string
  description: string | null
  created_at: string
  branches?: Branch[]
}
