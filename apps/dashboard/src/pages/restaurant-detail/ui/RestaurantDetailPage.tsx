import { useState, useEffect, useRef } from "react"
import { Link, useParams } from "@tanstack/react-router"
import { ArrowLeft, X, Upload, Save } from "lucide-react"
import { Button } from "@qonaqta/ui/components/button"
import { Input } from "@qonaqta/ui/components/input"
import { Label } from "@qonaqta/ui/components/label"
import { cn } from "@qonaqta/ui/lib/utils"
import {
  useRestaurant,
  useUpdateRestaurant,
  useUploadPhoto,
  useDeletePhoto,
  useUpdateSchedules,
  useCities,
} from "@/features/restaurants"
import { useCuisines } from "@/features/cuisines"
import type { RestaurantDetail, Schedule } from "@/features/restaurants"

const DAY_NAMES = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]

function BasicInfoSection({ restaurant, cities }: { restaurant: RestaurantDetail; cities: { id: number; name: string; slug: string }[] }) {
  const [form, setForm] = useState({
    name: restaurant.name,
    city_id: restaurant.city_id,
    address: restaurant.address,
    phone: restaurant.phone ?? "",
    description: restaurant.description ?? "",
    instagram: restaurant.instagram ?? "",
    telegram: restaurant.telegram ?? "",
    tiktok: restaurant.tiktok ?? "",
    whatsapp: restaurant.whatsapp ?? "",
    website: restaurant.website ?? "",
    two_gis: restaurant.two_gis ?? "",
    is_active: restaurant.is_active,
  })

  useEffect(() => {
    setForm({
      name: restaurant.name,
      city_id: restaurant.city_id,
      address: restaurant.address,
      phone: restaurant.phone ?? "",
      description: restaurant.description ?? "",
      instagram: restaurant.instagram ?? "",
      telegram: restaurant.telegram ?? "",
      tiktok: restaurant.tiktok ?? "",
      whatsapp: restaurant.whatsapp ?? "",
      website: restaurant.website ?? "",
      two_gis: restaurant.two_gis ?? "",
      is_active: restaurant.is_active,
    })
  }, [restaurant])

  const updateMutation = useUpdateRestaurant()

  const handleSave = () => {
    updateMutation.mutate({
      id: restaurant.id,
      payload: {
        name: form.name,
        city_id: form.city_id,
        address: form.address || undefined,
        phone: form.phone || undefined,
        description: form.description || undefined,
        instagram: form.instagram || undefined,
        telegram: form.telegram || undefined,
        tiktok: form.tiktok || undefined,
        whatsapp: form.whatsapp || undefined,
        website: form.website || undefined,
        two_gis: form.two_gis || undefined,
        is_active: form.is_active,
      },
    })
  }

  const update = (key: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6">
      <h2 className="text-[15px] font-semibold text-neutral-900">Основная информация</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-[13px] text-neutral-600">Название</Label>
          <Input value={form.name} onChange={(e) => update("name", e.target.value)} className="h-10 rounded-xl text-[14px]" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[13px] text-neutral-600">Город</Label>
          <select
            value={form.city_id}
            onChange={(e) => update("city_id", Number(e.target.value))}
            className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-[14px] text-neutral-900 outline-none transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-400/20"
          >
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-[13px] text-neutral-600">Адрес</Label>
          <Input value={form.address} onChange={(e) => update("address", e.target.value)} className="h-10 rounded-xl text-[14px]" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[13px] text-neutral-600">Телефон</Label>
          <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="h-10 rounded-xl text-[14px]" placeholder="+7 (700) 000-00-00" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[13px] text-neutral-600">Сайт</Label>
          <Input value={form.website} onChange={(e) => update("website", e.target.value)} className="h-10 rounded-xl text-[14px]" placeholder="https://" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-[13px] text-neutral-600">Описание</Label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-neutral-200 bg-transparent px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-neutral-300 focus:ring-2 focus:ring-neutral-200/50"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[13px] text-neutral-600">Instagram</Label>
          <Input value={form.instagram} onChange={(e) => update("instagram", e.target.value)} className="h-10 rounded-xl text-[14px]" placeholder="@username" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[13px] text-neutral-600">Telegram</Label>
          <Input value={form.telegram} onChange={(e) => update("telegram", e.target.value)} className="h-10 rounded-xl text-[14px]" placeholder="@username" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[13px] text-neutral-600">TikTok</Label>
          <Input value={form.tiktok} onChange={(e) => update("tiktok", e.target.value)} className="h-10 rounded-xl text-[14px]" placeholder="@username" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[13px] text-neutral-600">WhatsApp</Label>
          <Input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} className="h-10 rounded-xl text-[14px]" placeholder="+7 700 000 0000" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-[13px] text-neutral-600">2GIS</Label>
          <Input value={form.two_gis} onChange={(e) => update("two_gis", e.target.value)} className="h-10 rounded-xl text-[14px]" placeholder="https://2gis.kz/..." />
        </div>
        <div className="flex items-center gap-3 sm:col-span-2">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => update("is_active", e.target.checked)}
              className="size-4 rounded border-neutral-300"
            />
            <span className="text-[13px] text-neutral-700">Активен</span>
          </label>
        </div>
      </div>
      <div className="mt-6">
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="gap-1.5 rounded-xl bg-neutral-900 text-[13px] text-white hover:bg-neutral-800"
        >
          <Save className="size-4" />
          {updateMutation.isPending ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>
    </div>
  )
}

function CuisinesSection({ restaurant }: { restaurant: RestaurantDetail }) {
  const { data: allCuisines } = useCuisines()
  const [selectedIds, setSelectedIds] = useState<number[]>(restaurant.cuisines.map((c) => c.id))
  const updateMutation = useUpdateRestaurant()

  useEffect(() => {
    setSelectedIds(restaurant.cuisines.map((c) => c.id))
  }, [restaurant.cuisines])

  const toggle = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSave = () => {
    updateMutation.mutate({
      id: restaurant.id,
      payload: { cuisine_ids: selectedIds },
    })
  }

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6">
      <h2 className="text-[15px] font-semibold text-neutral-900">Кухни</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {allCuisines?.map((cuisine) => (
          <label
            key={cuisine.id}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-[13px] transition-colors",
              selectedIds.includes(cuisine.id)
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
            )}
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(cuisine.id)}
              onChange={() => toggle(cuisine.id)}
              className="hidden"
            />
            {cuisine.name}
          </label>
        ))}
      </div>
      {(!allCuisines || allCuisines.length === 0) && (
        <p className="mt-4 text-[13px] text-neutral-400">Нет доступных кухонь</p>
      )}
      <div className="mt-6">
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="gap-1.5 rounded-xl bg-neutral-900 text-[13px] text-white hover:bg-neutral-800"
        >
          <Save className="size-4" />
          {updateMutation.isPending ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>
    </div>
  )
}

function PhotosSection({ restaurant }: { restaurant: RestaurantDetail }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadMutation = useUploadPhoto()
  const deleteMutation = useDeletePhoto()

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    uploadMutation.mutate({ id: restaurant.id, files: Array.from(files) })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-neutral-900">Фотографии</h2>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="gap-1.5 rounded-xl bg-neutral-900 text-[13px] text-white hover:bg-neutral-800"
        >
          <Upload className="size-4" />
          {uploadMutation.isPending ? "Загрузка..." : "Загрузить"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
      </div>
      {restaurant.photos.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {restaurant.photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-neutral-100">
              <img src={photo.image_url} alt="" className="size-full object-cover" />
              <button
                onClick={() => deleteMutation.mutate({ restaurantId: restaurant.id, photoId: photo.id })}
                className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-lg bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-[13px] text-neutral-400">Нет фотографий</p>
      )}
    </div>
  )
}

function ScheduleSection({ restaurant }: { restaurant: RestaurantDetail }) {
  const [rows, setRows] = useState<Omit<Schedule, "id" | "branch_id">[]>(() =>
    DAY_NAMES.map((_, i) => {
      const existing = restaurant.schedules.find((s) => s.day_of_week === i)
      return {
        day_of_week: i,
        open_time: existing?.open_time ?? "09:00",
        close_time: existing?.close_time ?? "22:00",
        is_closed: existing?.is_closed ?? false,
      }
    })
  )

  useEffect(() => {
    setRows(
      DAY_NAMES.map((_, i) => {
        const existing = restaurant.schedules.find((s) => s.day_of_week === i)
        return {
          day_of_week: i,
          open_time: existing?.open_time ?? "09:00",
          close_time: existing?.close_time ?? "22:00",
          is_closed: existing?.is_closed ?? false,
        }
      })
    )
  }, [restaurant.schedules])

  const updateSchedulesMutation = useUpdateSchedules()

  const updateRow = (index: number, key: string, value: string | boolean) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [key]: value } : r)))
  }

  const handleSave = () => {
    updateSchedulesMutation.mutate({ id: restaurant.id, schedules: rows })
  }

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6">
      <h2 className="text-[15px] font-semibold text-neutral-900">Расписание</h2>
      <div className="mt-4 space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-neutral-100 px-4 py-2.5">
            <span className="w-28 shrink-0 text-[13px] font-medium text-neutral-700">
              {DAY_NAMES[i]}
            </span>
            <input
              type="time"
              value={row.open_time}
              onChange={(e) => updateRow(i, "open_time", e.target.value)}
              disabled={row.is_closed}
              className={cn(
                "h-9 rounded-lg border border-neutral-200 px-2 text-[13px] outline-none transition-colors focus:border-neutral-400",
                row.is_closed && "opacity-40"
              )}
            />
            <span className="text-[13px] text-neutral-400">-</span>
            <input
              type="time"
              value={row.close_time}
              onChange={(e) => updateRow(i, "close_time", e.target.value)}
              disabled={row.is_closed}
              className={cn(
                "h-9 rounded-lg border border-neutral-200 px-2 text-[13px] outline-none transition-colors focus:border-neutral-400",
                row.is_closed && "opacity-40"
              )}
            />
            <label className="ml-auto flex cursor-pointer items-center gap-1.5">
              <input
                type="checkbox"
                checked={row.is_closed}
                onChange={(e) => updateRow(i, "is_closed", e.target.checked)}
                className="size-4 rounded border-neutral-300"
              />
              <span className="text-[12px] text-neutral-500">Закрыт</span>
            </label>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Button
          onClick={handleSave}
          disabled={updateSchedulesMutation.isPending}
          className="gap-1.5 rounded-xl bg-neutral-900 text-[13px] text-white hover:bg-neutral-800"
        >
          <Save className="size-4" />
          {updateSchedulesMutation.isPending ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>
    </div>
  )
}

export function RestaurantDetailPage() {
  const { id } = useParams({ from: "/layout/restaurants/$id" })
  const numericId = Number(id)

  const { data: restaurant, isLoading } = useRestaurant(numericId)
  const { data: cities } = useCities()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 animate-pulse rounded-lg bg-neutral-100" />
        <div className="h-20 animate-pulse rounded-2xl bg-neutral-100" />
        <div className="h-60 animate-pulse rounded-2xl bg-neutral-100" />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
        <p className="text-[15px] font-semibold text-neutral-900">Ресторан не найден</p>
        <Link to="/restaurants" className="mt-3 text-[13px] text-neutral-500 underline underline-offset-4">
          Все рестораны
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link
        to="/restaurants"
        className="inline-flex items-center gap-1.5 text-[13px] text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <ArrowLeft className="size-4" />
        Все рестораны
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-neutral-900">
          <span className="text-[18px] font-bold text-white">
            {restaurant.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
              {restaurant.name}
            </h1>
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                restaurant.is_active
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-neutral-100 text-neutral-500"
              )}
            >
              {restaurant.is_active ? "активен" : "неактивен"}
            </span>
          </div>
          <p className="mt-0.5 text-[13px] text-neutral-400">
            {restaurant.city?.name} · {restaurant.address}
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <BasicInfoSection restaurant={restaurant} cities={cities ?? []} />
        <CuisinesSection restaurant={restaurant} />
        <PhotosSection restaurant={restaurant} />
        <ScheduleSection restaurant={restaurant} />
      </div>
    </div>
  )
}
