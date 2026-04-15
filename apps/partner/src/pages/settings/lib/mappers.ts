import type { ContactsData, ProfileData, WorkingHoursData } from "../model/types"
import { DEFAULT_PROFILE, DEFAULT_WORKING_HOURS, DAYS_ORDER } from "../model/constants"

export interface BranchPhoto {
  id: number
  image_url: string
  sort_order: number
}

export interface BranchSchedule {
  id: number
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}

export interface BranchCuisine {
  id: number
  name: string
  slug: string
}

export interface BranchData {
  id: number
  restaurant_id: number
  name: string
  slug: string
  address: string
  phone: string | null
  description: string | null
  instagram: string | null
  telegram: string | null
  tiktok: string | null
  whatsapp: string | null
  website: string | null
  two_gis: string | null
  photos: BranchPhoto[]
  schedules: BranchSchedule[]
  cuisines: BranchCuisine[]
}

export function branchToProfile(branch: BranchData): ProfileData {
  return {
    ...DEFAULT_PROFILE,
    name: branch.name ?? "",
    description: branch.description ?? "",
    address: branch.address ?? "",
    cuisineTypes: branch.cuisines.map((c) => c.name),
    socialInstagram: branch.instagram ?? "",
    socialWebsite: branch.website ?? "",
    social2gis: branch.two_gis ?? "",
    socialGoogleMaps: "",
    photos: branch.photos
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((p) => p.image_url),
  }
}

export function branchToContacts(branch: BranchData): ContactsData {
  return {
    phone: branch.phone ?? "",
    whatsapp: branch.whatsapp ?? "",
    instagram: branch.instagram ?? "",
    tiktok: branch.tiktok ?? "",
  }
}

export function branchToWorkingHours(branch: BranchData): WorkingHoursData {
  if (branch.schedules.length === 0) return DEFAULT_WORKING_HOURS

  const dayMap: Record<number, BranchSchedule> = {}
  for (const s of branch.schedules) {
    dayMap[s.day_of_week] = s
  }

  const days: WorkingHoursData["days"] = {} as WorkingHoursData["days"]
  DAYS_ORDER.forEach((day, i) => {
    const s = dayMap[i]
    if (s) {
      days[day] = { open: s.open_time, close: s.close_time, enabled: !s.is_closed }
    } else {
      days[day] = { open: "09:00", close: "23:00", enabled: true }
    }
  })

  const allSame = DAYS_ORDER.every(
    (d) => days[d].open === days[DAYS_ORDER[0]].open &&
           days[d].close === days[DAYS_ORDER[0]].close &&
           days[d].enabled === days[DAYS_ORDER[0]].enabled
  )

  return {
    sameForAll: allSame,
    allDays: { open: days[DAYS_ORDER[0]].open, close: days[DAYS_ORDER[0]].close },
    days,
  }
}
