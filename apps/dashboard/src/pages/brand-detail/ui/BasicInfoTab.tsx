import { useState } from "react"
import { Save } from "lucide-react"
import { Button } from "@qonaqta/ui/components/button"
import { Input } from "@qonaqta/ui/components/input"
import { Label } from "@qonaqta/ui/components/label"
import { Switch } from "@qonaqta/ui/components/switch"
import { useUpdateBrand, type Brand } from "@/features/brands"

export function BasicInfoTab({ brand }: { brand: Brand }) {
  const [name, setName] = useState(brand.name)
  const [slug, setSlug] = useState(brand.slug)
  const [description, setDescription] = useState(brand.description ?? "")
  const [isActive, setIsActive] = useState(brand.is_active)

  const updateMutation = useUpdateBrand()

  const hasChanges =
    name !== brand.name ||
    slug !== brand.slug ||
    (description || null) !== brand.description ||
    isActive !== brand.is_active

  const handleSave = () => {
    const payload: Record<string, string | boolean | null> = {}
    if (name !== brand.name) payload.name = name
    if (slug !== brand.slug) payload.slug = slug
    if ((description || null) !== brand.description) payload.description = description || null
    if (isActive !== brand.is_active) payload.is_active = isActive
    updateMutation.mutate({ id: brand.id, payload })
  }

  return (
    <div className="max-w-2xl">
      <div className="space-y-5 rounded-2xl border border-neutral-100 bg-white p-6">
        <div className="space-y-1.5">
          <Label className="text-[13px] text-neutral-600">Название</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 rounded-xl text-[14px]"
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
            rows={4}
            placeholder="Кратко о бренде"
            className="w-full resize-none rounded-xl border border-neutral-200 bg-transparent px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-neutral-300 focus:ring-2 focus:ring-neutral-200/50"
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-neutral-100 px-4 py-3">
          <div>
            <p className="text-[13px] font-medium text-neutral-900">Активен</p>
            <p className="mt-0.5 text-[11px] text-neutral-400">
              Неактивные бренды не видны гостям
            </p>
          </div>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || !name || !slug || updateMutation.isPending}
          className="gap-1.5 rounded-xl bg-neutral-900 text-[13px] text-white hover:bg-neutral-800"
        >
          <Save className="size-4" />
          {updateMutation.isPending ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>
    </div>
  )
}
