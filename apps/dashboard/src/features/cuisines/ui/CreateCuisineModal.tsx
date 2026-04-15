import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@qonaqta/ui/components/button"
import { Input } from "@qonaqta/ui/components/input"
import { Label } from "@qonaqta/ui/components/label"
import { slugify } from "@/shared/lib/slugify"
import { useCreateCuisine } from "../api"

export function CreateCuisineModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugEdited, setSlugEdited] = useState(false)

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slugEdited) {
      setSlug(slugify(value))
    }
  }

  const createMutation = useCreateCuisine(onClose)

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Добавить кухню</h2>
            <button onClick={onClose} className="flex size-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-50">
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Название</Label>
              <Input
                placeholder="Итальянская"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="h-10 rounded-xl text-[14px]"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Slug</Label>
              <Input
                placeholder="italian"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugEdited(true) }}
                className="h-10 rounded-xl font-mono text-[13px]"
              />
              <p className="text-[11px] text-neutral-300">Только латиница, цифры и дефис</p>
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
              disabled={!name || !slug || createMutation.isPending}
              onClick={() => createMutation.mutate({ name, slug })}
              className="flex-1 rounded-xl bg-neutral-900 text-[13px] text-white hover:bg-neutral-800"
            >
              {createMutation.isPending ? "Создание..." : "Добавить"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
