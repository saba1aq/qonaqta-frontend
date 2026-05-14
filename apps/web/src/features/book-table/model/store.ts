import { create } from 'zustand'

export type ContactMethod = 'phone' | 'whatsapp'

interface BookingFormState {
  guestCount: number
  date: string | null
  timeSlot: string | null
  guestName: string
  guestPhone: string
  notes: string
  contactMethod: ContactMethod
  setGuestCount: (count: number) => void
  setDate: (date: string) => void
  setTimeSlot: (slot: string) => void
  setGuestInfo: (name: string, phone: string) => void
  setNotes: (notes: string) => void
  setContactMethod: (method: ContactMethod) => void
  reset: () => void
}

function todayStr() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const initialState = {
  guestCount: 2,
  date: todayStr() as string | null,
  timeSlot: null as string | null,
  guestName: '',
  guestPhone: '',
  notes: '',
  contactMethod: 'phone' as ContactMethod,
}

export const useBookingFormStore = create<BookingFormState>((set) => ({
  ...initialState,

  setGuestCount: (count: number) => set({ guestCount: Math.max(1, Math.min(20, count)) }),
  setDate: (date: string) => set({ date, timeSlot: null }),
  setTimeSlot: (slot: string) => set({ timeSlot: slot }),
  setGuestInfo: (name: string, phone: string) => set({ guestName: name, guestPhone: phone }),
  setNotes: (notes: string) => set({ notes }),
  setContactMethod: (method: ContactMethod) => set({ contactMethod: method }),
  reset: () => set(initialState),
}))
