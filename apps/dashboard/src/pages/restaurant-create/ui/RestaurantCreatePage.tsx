import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@qonaqta/ui/components/button"
import { Input } from "@qonaqta/ui/components/input"
import { Label } from "@qonaqta/ui/components/label"
import { useCreateRestaurant, useCities } from "@/features/restaurants"
import { useCuisines } from "@/features/cuisines"
import { cn } from "@qonaqta/ui/lib/utils"

export function RestaurantCreatePage() {
  const navigate = useNavigate()
  const { data: cities } = useCities()
  const { data: cuisines } = useCuisines()
  const createMutation = useCreateRestaurant((restaurant) => {
    navigate({ to: "/restaurants/$id", params: { id: String(restaurant.id) } })
  })

  const [form, setForm] = useState({
    name: "",
    city_id: 0,
    address: "",
    phone: "",
    description: "",
    instagram: "",
    telegram: "",
    tiktok: "",
    whatsapp: "",
    website: "",
    two_gis: "",
  })

  const [selectedCuisineIds, setSelectedCuisineIds] = useState<number[]>([])

  const update = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleCuisine = (id: number) => {
    setSelectedCuisineIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSubmit = () => {
    if (!form.name || !form.city_id) return
    createMutation.mutate({
      name: form.name,
      city_id: form.city_id,
      address: form.address || undefined,
      phone: form.phone || undefined,
      description: form.description || undefined,
      cuisine_ids: selectedCuisineIds.length > 0 ? selectedCuisineIds : undefined,
    })
  }

  if (cities && cities.length > 0 && form.city_id === 0) {
    setForm((prev) => ({ ...prev, city_id: cities[0].id }))
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

      <div className="mt-4">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          Новый ресторан
        </h1>
        <p className="mt-0.5 text-[13px] text-neutral-400">
          Заполните информацию о ресторане
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <div className="rounded-2xl border border-neutral-100 bg-white p-6">
          <h2 className="text-[15px] font-semibold text-neutral-900">Основная информация</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Название *</Label>
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} className="h-10 rounded-xl text-[14px]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Город *</Label>
              <select
                value={form.city_id}
                onChange={(e) => update("city_id", Number(e.target.value))}
                className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-[14px] text-neutral-900 outline-none transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-400/20"
              >
                {cities?.map((c) => (
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
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-white p-6">
          <h2 className="text-[15px] font-semibold text-neutral-900">Кухни</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {cuisines?.map((cuisine) => (
              <label
                key={cuisine.id}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-[13px] transition-colors",
                  selectedCuisineIds.includes(cuisine.id)
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                )}
              >
                <input
                  type="checkbox"
                  checked={selectedCuisineIds.includes(cuisine.id)}
                  onChange={() => toggleCuisine(cuisine.id)}
                  className="hidden"
                />
                {cuisine.name}
              </label>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={createMutation.isPending || !form.name || !form.city_id}
          className="gap-1.5 rounded-xl bg-neutral-900 px-6 text-[13px] text-white hover:bg-neutral-800"
        >
          <Save className="size-4" />
          {createMutation.isPending ? "Создание..." : "Создать ресторан"}
        </Button>
      </div>
    </div>
  )
}
