import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Plus, UtensilsCrossed, Search, Trash2, X } from "lucide-react"
import { Button } from "@qonaqta/ui/components/button"
import { Input } from "@qonaqta/ui/components/input"
import { Label } from "@qonaqta/ui/components/label"
import { Badge } from "@qonaqta/ui/components/badge"
import { apiClient } from "@/shared/api"

interface Cuisine {
  id: number
  name: string
  slug: string
}

function useCuisines() {
  return useQuery<Cuisine[]>({
    queryKey: ["hub-cuisines"],
    queryFn: async () => {
      const { data } = await apiClient.get("/cuisines")
      return data
    },
  })
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[а-яё]/g, (ch) => {
      const map: Record<string, string> = {
        а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo",
        ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
        н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
        ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
        ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
      }
      return map[ch] ?? ch
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function CreateCuisineModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugEdited, setSlugEdited] = useState(false)
  const queryClient = useQueryClient()

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slugEdited) {
      setSlug(slugify(value))
    }
  }

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post("/cuisines", { name, slug })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hub-cuisines"] })
      toast.success("Кухня добавлена")
      onClose()
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 409) {
        toast.error(`Кухня со slug '${slug}' уже существует`)
      } else {
        toast.error("Ошибка при создании")
      }
    },
  })

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
              onClick={() => createMutation.mutate()}
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

function CuisineCard({ cuisine }: { cuisine: Cuisine }) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: () => apiClient.delete(`/cuisines/${cuisine.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hub-cuisines"] })
      toast.success("Кухня удалена")
    },
    onError: () => {
      toast.error("Ошибка при удалении")
    },
  })

  return (
    <div className="group flex items-center justify-between rounded-xl border border-neutral-100 bg-white px-4 py-3 transition-all hover:border-neutral-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-neutral-100">
          <UtensilsCrossed className="size-4 text-neutral-500" />
        </div>
        <div>
          <p className="text-[14px] font-medium text-neutral-900">{cuisine.name}</p>
          <Badge variant="secondary" className="mt-0.5 text-[11px] font-normal text-neutral-400">
            {cuisine.slug}
          </Badge>
        </div>
      </div>
      <button
        onClick={() => deleteMutation.mutate()}
        disabled={deleteMutation.isPending}
        className="flex size-8 items-center justify-center rounded-lg text-neutral-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white/50 py-24">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-neutral-100">
        <UtensilsCrossed className="size-7 text-neutral-300" />
      </div>
      <h3 className="mt-5 text-[15px] font-semibold text-neutral-900">
        Нет кухонь
      </h3>
      <p className="mt-1.5 max-w-[280px] text-center text-[13px] text-neutral-400">
        Добавьте типы кухонь, чтобы рестораны могли указывать свою специализацию
      </p>
      <Button
        onClick={onCreate}
        className="mt-6 gap-1.5 rounded-xl bg-neutral-900 px-5 text-[13px] text-white hover:bg-neutral-800"
      >
        <Plus className="size-4" />
        Добавить кухню
      </Button>
    </div>
  )
}

export function CuisinesPage() {
  const { data: cuisines, isLoading } = useCuisines()
  const [search, setSearch] = useState("")
  const [showCreate, setShowCreate] = useState(false)

  const filtered = cuisines?.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
            Кухни
          </h1>
          <p className="mt-0.5 text-[13px] text-neutral-400">
            {cuisines?.length
              ? `${cuisines.length} ${cuisines.length === 1 ? "тип" : "типов"} кухни`
              : "Управление типами кухонь"}
          </p>
        </div>
        {cuisines && cuisines.length > 0 && (
          <Button
            onClick={() => setShowCreate(true)}
            className="gap-1.5 rounded-xl bg-neutral-900 text-[13px] text-white hover:bg-neutral-800"
          >
            <Plus className="size-4" />
            Добавить кухню
          </Button>
        )}
      </div>

      {cuisines && cuisines.length > 0 && (
        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-300" />
          <Input
            placeholder="Поиск по названию или slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-xl border-neutral-200 bg-white pl-10 text-[13px] placeholder:text-neutral-300 focus-visible:border-neutral-300 focus-visible:ring-neutral-200/50"
          />
        </div>
      )}

      {isLoading ? (
        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[60px] animate-pulse rounded-xl bg-neutral-100" />
          ))}
        </div>
      ) : !filtered || filtered.length === 0 ? (
        search ? (
          <div className="mt-12 text-center">
            <p className="text-sm text-neutral-400">
              Ничего не найдено по запросу «{search}»
            </p>
          </div>
        ) : (
          <EmptyState onCreate={() => setShowCreate(true)} />
        )
      ) : (
        <div className="mt-6 space-y-2">
          {filtered.map((cuisine) => (
            <CuisineCard key={cuisine.id} cuisine={cuisine} />
          ))}
        </div>
      )}

      {showCreate && <CreateCuisineModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
