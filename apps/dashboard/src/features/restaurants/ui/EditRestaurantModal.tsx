import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@qonaqta/ui/components/button"
import { Input } from "@qonaqta/ui/components/input"
import { Label } from "@qonaqta/ui/components/label"
import { useUpdateRestaurant, type UpdateBrandPayload } from "../api"
import type { Restaurant } from "../model/types"

export function EditRestaurantModal({ restaurant, onClose }: { restaurant: Restaurant; onClose: () => void }) {
  const [name, setName] = useState(restaurant.name)
  const [slug, setSlug] = useState(restaurant.slug)
  const [description, setDescription] = useState(restaurant.description ?? "")

  const updateMutation = useUpdateRestaurant(onClose)

  const hasChanges =
    name !== restaurant.name ||
    slug !== restaurant.slug ||
    (description || null) !== restaurant.description

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Редактировать бренд</h2>
            <button onClick={onClose} className="flex size-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-50">
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Название</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 rounded-xl text-[14px]"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Slug (URL)</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="h-10 rounded-xl font-mono text-[13px]"
              />
              <p className="text-[11px] text-neutral-300">qonaqta.kz/restaurant/{slug || "..."}</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Описание</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-neutral-200 bg-transparent px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-neutral-300 focus:ring-2 focus:ring-neutral-200/50"
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
              disabled={!name || !slug || !hasChanges || updateMutation.isPending}
              onClick={() => {
                const payload: UpdateBrandPayload = {}
                if (name !== restaurant.name) payload.name = name
                if (slug !== restaurant.slug) payload.slug = slug
                if ((description || null) !== restaurant.description) {
                  payload.description = description || null
                }
                updateMutation.mutate({ id: restaurant.id, payload })
              }}
              className="flex-1 rounded-xl bg-neutral-900 text-[13px] text-white hover:bg-neutral-800"
            >
              {updateMutation.isPending ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
