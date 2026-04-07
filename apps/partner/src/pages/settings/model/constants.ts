import type { ContactsData, DayOfWeek, ProfileData, SettingsTab, WorkingHoursData } from "./types";

export const DEFAULT_CONTACTS: ContactsData = {
  phone: "",
  whatsapp: "",
  instagram: "",
  tiktok: "",
};

const defaultDay = { open: "09:00", close: "23:00", enabled: true };

export const DEFAULT_WORKING_HOURS: WorkingHoursData = {
  sameForAll: true,
  allDays: { open: "09:00", close: "23:00" },
  days: {
    mon: { ...defaultDay },
    tue: { ...defaultDay },
    wed: { ...defaultDay },
    thu: { ...defaultDay },
    fri: { ...defaultDay },
    sat: { ...defaultDay },
    sun: { ...defaultDay },
  },
};

export const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: "Понедельник",
  tue: "Вторник",
  wed: "Среда",
  thu: "Четверг",
  fri: "Пятница",
  sat: "Суббота",
  sun: "Воскресенье",
};

export const DAYS_ORDER: DayOfWeek[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const SETTINGS_TABS: { id: SettingsTab; label: string }[] = [
  { id: "profile", label: "Профиль" },
];

export const CUISINE_OPTIONS = [
  "Казахская", "Европейская", "Азиатская", "Итальянская", "Японская",
  "Грузинская", "Узбекская", "Американская", "Французская", "Корейская",
];

export const VENUE_OPTIONS = [
  "Ресторан", "Кафе", "Бар", "Лаунж", "Кофейня", "Пиццерия", "Пекарня",
];

export const PARKING_OPTIONS = [
  "Бесплатная парковка", "Платная парковка", "Валет-парковка", "Нет парковки",
];

export interface FeatureItem {
  id: string;
  label: string;
  icon: string;
}

export const FEATURES_LIST: FeatureItem[] = [
  { id: "wifi", label: "Wi-Fi", icon: "wifi" },
  { id: "live_music", label: "Живая музыка", icon: "music" },
  { id: "terrace", label: "Терраса", icon: "sun" },
  { id: "parking", label: "Парковка", icon: "car" },
  { id: "halal", label: "Халяль", icon: "check" },
  { id: "hookah", label: "Кальян", icon: "cloud" },
  { id: "pet_friendly", label: "С животными", icon: "paw" },
  { id: "kids_room", label: "Детская", icon: "baby" },
  { id: "accessible", label: "Доступная среда", icon: "accessibility" },
  { id: "private_rooms", label: "Кабинеты", icon: "door-closed" },
  { id: "vegan", label: "Веган меню", icon: "leaf" },
  { id: "gluten_free", label: "Без глютена", icon: "wheat-off" },
];

export const DEFAULT_PROFILE: ProfileData = {
  name: "Ogonyok Restaurant",
  tagline: "Современная казахская кухня с видом на горы",
  description: "Ogonyok — современный ресторан в самом сердце Алматы, предлагающий переосмысленную казахскую кухню с панорамным видом на горы Тянь-Шаня. Идеален для романтических ужинов, деловых встреч и торжеств.",
  cuisineTypes: ["Казахская", "Европейская"],
  venueType: "Ресторан",
  priceRange: 2,
  averageCheck: "8 500",
  address: "ул. Абылай хана 52, Алматы",
  neighborhood: "Медеуский район",
  parking: "Бесплатная парковка",
  features: ["wifi", "live_music", "terrace", "parking", "halal", "hookah"],
  socialInstagram: "@ogonyok.almaty",
  socialWebsite: "www.ogonyok.kz",
  social2gis: "",
  socialGoogleMaps: "",
  photos: [],
};
