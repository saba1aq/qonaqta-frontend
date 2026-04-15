import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@qonaqta/ui/components/button"
import { Input } from "@qonaqta/ui/components/input"
import {
  useRestaurants,
  RestaurantCard,
  CreateRestaurantModal,
  RestaurantsEmptyState,
} from "@/features/restaurants"

export function RestaurantsPage() {
  const { data: restaurants, isLoading } = useRestaurants()
  const [search, setSearch] = useState("")
  const [showCreate, setShowCreate] = useState(false)

  const filtered = restaurants?.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
            Рестораны
          </h1>
          <p className="mt-0.5 text-[13px] text-neutral-400">
            {restaurants?.length
              ? `${restaurants.length} ${restaurants.length === 1 ? "бренд" : "брендов"} на платформе`
              : "Управление брендами и филиалами"}
          </p>
        </div>
        {restaurants && restaurants.length > 0 && (
          <Button
            onClick={() => setShowCreate(true)}
            className="gap-1.5 rounded-xl bg-neutral-900 text-[13px] text-white hover:bg-neutral-800"
          >
            <Plus className="size-4" />
            Создать бренд
          </Button>
        )}
      </div>

      {restaurants && restaurants.length > 0 && (
        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-300" />
          <Input
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-xl border-neutral-200 bg-white pl-10 text-[13px] placeholder:text-neutral-300 focus-visible:border-neutral-300 focus-visible:ring-neutral-200/50"
          />
        </div>
      )}

      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[200px] animate-pulse rounded-2xl bg-neutral-100" />
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
          <RestaurantsEmptyState onCreate={() => setShowCreate(true)} />
        )
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}

      {showCreate && <CreateRestaurantModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
