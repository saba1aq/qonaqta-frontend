import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@qonaqta/ui/components/button"
import { Input } from "@qonaqta/ui/components/input"
import {
  useBrands,
  BrandRow,
  CreateBrandModal,
  BrandsEmptyState,
} from "@/features/brands"

export function BrandsPage() {
  const { data: brands, isLoading } = useBrands()
  const [search, setSearch] = useState("")
  const [showCreate, setShowCreate] = useState(false)

  const filtered = brands?.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
            Бренды
          </h1>
          <p className="mt-0.5 text-[13px] text-neutral-400">
            {brands?.length
              ? `${brands.length} ${brands.length === 1 ? "бренд" : "брендов"} на платформе`
              : "Управление брендами, филиалами и админами"}
          </p>
        </div>
        {brands && brands.length > 0 && (
          <Button
            onClick={() => setShowCreate(true)}
            className="gap-1.5 rounded-xl bg-neutral-900 text-[13px] text-white hover:bg-neutral-800"
          >
            <Plus className="size-4" />
            Создать бренд
          </Button>
        )}
      </div>

      {brands && brands.length > 0 && (
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
        <div className="mt-6 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[68px] animate-pulse rounded-xl bg-neutral-100" />
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
          <BrandsEmptyState onCreate={() => setShowCreate(true)} />
        )
      ) : (
        <div className="mt-6 space-y-2">
          {filtered.map((brand) => (
            <BrandRow key={brand.id} brand={brand} />
          ))}
        </div>
      )}

      {showCreate && <CreateBrandModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
