import { useState, useEffect } from "react"
import { Save } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/shared/ui/button"
import { apiClient, API_URL } from "@/shared/api"
import type { ContactsData, ProfileData, WorkingHoursData, DayOfWeek } from "../model/types"
import { DEFAULT_CONTACTS, DEFAULT_PROFILE, DEFAULT_WORKING_HOURS, DAYS_ORDER } from "../model/constants"
import { ProfileTab } from "./ProfileTab"

interface BranchPhoto {
  id: number
  image_url: string
  sort_order: number
}

interface BranchSchedule {
  id: number
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}

interface BranchCuisine {
  id: number
  name: string
  slug: string
}

interface BranchData {
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

async function fetchBranchContext() {
  const { data: restaurants } = await apiClient.get("/admin/restaurants")
  const restaurant = restaurants[0]
  if (!restaurant) return { branchId: null, restaurantId: null }
  const { data: branches } = await apiClient.get("/admin/branches")
  const branch = branches.find((b: { restaurant_id: number }) => b.restaurant_id === restaurant.id)
  return { branchId: branch?.id ?? null, restaurantId: restaurant.id }
}

function branchToProfile(branch: BranchData): ProfileData {
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

function branchToContacts(branch: BranchData): ContactsData {
  return {
    phone: branch.phone ?? "",
    whatsapp: branch.whatsapp ?? "",
    instagram: branch.instagram ?? "",
    tiktok: branch.tiktok ?? "",
  }
}

function branchToWorkingHours(branch: BranchData): WorkingHoursData {
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

export function SettingsPage() {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE)
  const [contacts, setContacts] = useState<ContactsData>(DEFAULT_CONTACTS)
  const [workingHours, setWorkingHours] = useState<WorkingHoursData>(DEFAULT_WORKING_HOURS)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [deletedPhotoIds, setDeletedPhotoIds] = useState<number[]>([])
  const [branchPhotos, setBranchPhotos] = useState<BranchPhoto[]>([])

  const queryClient = useQueryClient()

  const { data: context } = useQuery({
    queryKey: ["admin-context"],
    queryFn: fetchBranchContext,
    staleTime: Infinity,
  })

  const branchId = context?.branchId

  const { data: branchData } = useQuery({
    queryKey: ["admin-branch", branchId],
    queryFn: async () => {
      const { data } = await apiClient.get<BranchData>(`/admin/branches/${branchId}`)
      return data
    },
    enabled: !!branchId,
  })

  useEffect(() => {
    if (branchData) {
      setProfile(branchToProfile(branchData))
      setContacts(branchToContacts(branchData))
      setWorkingHours(branchToWorkingHours(branchData))
      setBranchPhotos(branchData.photos.sort((a, b) => a.sort_order - b.sort_order))
      setPendingFiles([])
      setDeletedPhotoIds([])
    }
  }, [branchData])

  const handlePhotosChange = (newPhotos: string[]) => {
    const existingUrls = branchPhotos.map((p) => p.image_url)
    const removed = existingUrls.filter((url) => !newPhotos.includes(url))
    const removedIds = branchPhotos
      .filter((p) => removed.includes(p.image_url))
      .map((p) => p.id)
    setDeletedPhotoIds((prev) => [...prev, ...removedIds])

    const newBlobUrls = newPhotos.filter((url) => url.startsWith("blob:"))
    setProfile((prev) => ({ ...prev, photos: newPhotos }))
    setPendingFiles((prev) => [...prev, ...newBlobUrls.map(() => null as unknown as File)])
  }

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return
    const remaining = 8 - profile.photos.length
    const selected = Array.from(files).slice(0, remaining)
    const urls = selected.map((file) => URL.createObjectURL(file))
    setProfile((prev) => ({ ...prev, photos: [...prev.photos, ...urls] }))
    setPendingFiles((prev) => [...prev, ...selected])
  }

  const handleRemovePhoto = (index: number) => {
    const url = profile.photos[index]
    const existingPhoto = branchPhotos.find((p) => p.image_url === url)
    if (existingPhoto) {
      setDeletedPhotoIds((prev) => [...prev, existingPhoto.id])
    } else {
      const blobIndex = profile.photos.slice(0, index).filter((u) => u.startsWith("blob:")).length
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url)
        setPendingFiles((prev) => prev.filter((_, i) => i !== blobIndex))
      }
    }
    setProfile((prev) => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }))
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!branchId) return

      await apiClient.put(`/admin/branches/${branchId}`, {
        name: profile.name,
        description: profile.description,
        address: profile.address,
        phone: contacts.phone,
        instagram: contacts.instagram,
        tiktok: contacts.tiktok,
        whatsapp: contacts.whatsapp,
        website: profile.socialWebsite,
        two_gis: profile.social2gis,
      })

      for (const photoId of deletedPhotoIds) {
        await apiClient.delete(`/admin/branches/${branchId}/photos/${photoId}`)
      }

      for (const file of pendingFiles) {
        const formData = new FormData()
        formData.append("file", file)
        await apiClient.post(`/admin/branches/${branchId}/photos`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      const schedules = DAYS_ORDER.map((day, i) => {
        if (workingHours.sameForAll) {
          return {
            day_of_week: i,
            open_time: workingHours.allDays.open,
            close_time: workingHours.allDays.close,
            is_closed: false,
          }
        }
        const s = workingHours.days[day]
        return {
          day_of_week: i,
          open_time: s.open,
          close_time: s.close,
          is_closed: !s.enabled,
        }
      })
      await apiClient.put(`/admin/branches/${branchId}/schedules`, { schedules })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-branch", branchId] })
      toast.success("Настройки сохранены")
    },
    onError: () => {
      toast.error("Ошибка при сохранении")
    },
  })

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="flex h-[calc(100svh-48px)] flex-col -m-6 lg:-m-8 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#1C1C1C]">Профиль ресторана</h1>
          <p className="mt-0.5 text-sm text-[#1C1C1C]/40">Как гости видят ваш ресторан в Qonaqta</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="gap-1.5 rounded-xl bg-[#232323] text-[13px]"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
          >
            <Save className="size-4" />
            {saveMutation.isPending ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </div>

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto">
        <ProfileTab
          profile={profile}
          onChange={updateProfile}
          contacts={contacts}
          workingHours={workingHours}
          onContactsChange={setContacts}
          onWorkingHoursChange={setWorkingHours}
          onFilesSelected={handleFilesSelected}
          onRemovePhoto={handleRemovePhoto}
        />
      </div>
    </div>
  )
}
