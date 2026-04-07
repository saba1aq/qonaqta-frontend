export interface ContactsData {
  phone: string;
  whatsapp: string;
  instagram: string;
  tiktok: string;
}

export interface DaySchedule {
  open: string;
  close: string;
  enabled: boolean;
}

export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type WorkingHoursData = {
  sameForAll: boolean;
  allDays: { open: string; close: string };
  days: Record<DayOfWeek, DaySchedule>;
};

export type SettingsTab = "profile";

export interface ProfileData {
  name: string;
  tagline: string;
  description: string;
  cuisineTypes: string[];
  venueType: string;
  priceRange: number;
  averageCheck: string;
  address: string;
  neighborhood: string;
  parking: string;
  features: string[];
  socialInstagram: string;
  socialWebsite: string;
  social2gis: string;
  socialGoogleMaps: string;
  photos: string[];
}
