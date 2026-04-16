import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@qonaqta/ui/components/button"
import { Input } from "@qonaqta/ui/components/input"
import { Label } from "@qonaqta/ui/components/label"
import { useCuisines } from "@/features/cuisines"
import { useCreateBranch } from "@/features/branches"

const MOCK_CITIES = [
  { id: 1, name: "Алматы" },
  { id: 2, name: "Астана" },
  { id: 3, name: "Шымкент" },
]

export function CreateBranchModal({ brandId, onClose }: { brandId: number; onClose: () => void }) {
  const { data: cuisines } = useCuisines()
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [cityId, setCityId] = useState<number | null>(1)
  const [phone, setPhone] = useState("")
  const [cuisineIds, setCuisineIds] = useState<number[]>([])

  const createMutation = useCreateBranch(brandId, onClose)

  const toggleCuisine = (id: number) => {
    setCuisineIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const canSubmit = name.trim() && address.trim() && cityId !== null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Добавить филиал</h2>
            <button onClick={onClose} className="flex size-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-50">
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Название филиала</Label>
              <Input
                placeholder="Del Papa Достык"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 rounded-xl text-[14px]"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Адрес</Label>
              <Input
                placeholder="пр. Достык, 123"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-10 rounded-xl text-[13px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Город</Label>
              <div className="flex flex-wrap gap-2">
                {MOCK_CITIES.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => setCityId(city.id)}
                    className={`rounded-lg border px-3 py-1.5 text-[13px] transition-colors ${
                      cityId === city.id
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Телефон</Label>
              <Input
                placeholder="+7 727 111 22 33"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 rounded-xl text-[13px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Кухни</Label>
              {cuisines && cuisines.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {cuisines.map((cuisine) => (
                    <button
                      key={cuisine.id}
                      onClick={() => toggleCuisine(cuisine.id)}
                      className={`rounded-lg border px-3 py-1.5 text-[13px] transition-colors ${
                        cuisineIds.includes(cuisine.id)
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      {cuisine.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-neutral-400">
                  Нет доступных кухонь. Добавьте их в разделе «Кухни».
                </p>
              )}
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
              disabled={!canSubmit || createMutation.isPending}
              onClick={() =>
                createMutation.mutate({
                  name,
                  address,
                  city_id: cityId,
                  phone: phone || null,
                  cuisine_ids: cuisineIds,
                })
              }
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
