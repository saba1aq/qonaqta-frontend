import { useState } from "react"
import { Save } from "lucide-react"
import { Button } from "@qonaqta/ui/components/button"
import type { ContactsData, ProfileData, WorkingHoursData } from "../model/types"
import { DEFAULT_CONTACTS, DEFAULT_PROFILE, DEFAULT_WORKING_HOURS } from "../model/constants"
import type { BranchPhoto } from "../lib/mappers"
import { branchToProfile, branchToContacts, branchToWorkingHours } from "../lib/mappers"
import { useBranchContext, useBranchData, useSaveSettings } from "../api"
import { ProfileTab } from "./ProfileTab"

export function SettingsPage() {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE)
  const [contacts, setContacts] = useState<ContactsData>(DEFAULT_CONTACTS)
  const [workingHours, setWorkingHours] = useState<WorkingHoursData>(DEFAULT_WORKING_HOURS)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [deletedPhotoIds, setDeletedPhotoIds] = useState<number[]>([])
  const [branchPhotos, setBranchPhotos] = useState<BranchPhoto[]>([])

  const { data: context } = useBranchContext()
  const branchId = context?.branchId

  const { data: branchData, dataUpdatedAt } = useBranchData(branchId)

  const [syncedAt, setSyncedAt] = useState(0)
  if (branchData && dataUpdatedAt !== syncedAt) {
    setSyncedAt(dataUpdatedAt)
    setProfile(branchToProfile(branchData))
    setContacts(branchToContacts(branchData))
    setWorkingHours(branchToWorkingHours(branchData))
    setBranchPhotos(branchData.photos.sort((a, b) => a.sort_order - b.sort_order))
    setPendingFiles([])
    setDeletedPhotoIds([])
  }

  const saveMutation = useSaveSettings(branchId, () => ({
    profile,
    contacts,
    workingHours,
    pendingFiles,
    deletedPhotoIds,
  }))

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
