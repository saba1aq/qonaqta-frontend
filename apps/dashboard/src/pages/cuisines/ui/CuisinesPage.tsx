import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@qonaqta/ui/components/button"
import { Input } from "@qonaqta/ui/components/input"
import {
  useCuisines,
  CuisineCard,
  CreateCuisineModal,
  EditCuisineModal,
  CuisinesEmptyState,
  type Cuisine,
} from "@/features/cuisines"

export function CuisinesPage() {
  const { data: cuisines, isLoading } = useCuisines()
  const [search, setSearch] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [editingCuisine, setEditingCuisine] = useState<Cuisine | null>(null)

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
        <div className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
          <CuisinesEmptyState onCreate={() => setShowCreate(true)} />
        )
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cuisine) => (
            <CuisineCard key={cuisine.id} cuisine={cuisine} onEdit={() => setEditingCuisine(cuisine)} />
          ))}
        </div>
      )}

      {showCreate && <CreateCuisineModal onClose={() => setShowCreate(false)} />}
      {editingCuisine && <EditCuisineModal cuisine={editingCuisine} onClose={() => setEditingCuisine(null)} />}
    </div>
  )
}
