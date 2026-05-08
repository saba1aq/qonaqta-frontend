import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@qonaqta/ui/components/button"
import { Input } from "@qonaqta/ui/components/input"
import { Label } from "@qonaqta/ui/components/label"
import { useCreateRestaurant, useCities } from "../api"

export function CreateRestaurantModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("")
  const [cityId, setCityId] = useState<number | "">("")
  const [address, setAddress] = useState("")

  const { data: cities } = useCities()
  const createMutation = useCreateRestaurant(onClose)

  const handleSubmit = () => {
    if (!name || !cityId) return
    createMutation.mutate({
      name,
      city_id: Number(cityId),
      address: address || undefined,
    })
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Создать ресторан</h2>
            <button onClick={onClose} className="flex size-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-50">
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Название</Label>
              <Input
                placeholder="Del Papa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 rounded-xl text-[14px]"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Город</Label>
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value ? Number(e.target.value) : "")}
                className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-[14px] text-neutral-900 outline-none transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-400/20"
              >
                <option value="">Выберите город</option>
                {cities?.map((city) => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Адрес</Label>
              <Input
                placeholder="ул. Абая 1"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-10 rounded-xl text-[14px]"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl text-[13px]"
            >
              Отмена
            </Button>
            <Button
              disabled={!name || !cityId || createMutation.isPending}
              onClick={handleSubmit}
              className="flex-1 rounded-xl bg-neutral-900 text-[13px] text-white hover:bg-neutral-800"
            >
              {createMutation.isPending ? "Создание..." : "Создать"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
