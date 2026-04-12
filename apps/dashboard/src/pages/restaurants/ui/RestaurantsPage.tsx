import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Plus,
  Store,
  MapPin,
  ChevronRight,
  Search,
  MoreHorizontal,
  Power,
  Pencil,
  Trash2,
} from "lucide-react"
import { cn } from "@qonaqta/ui/lib/utils"
import { Button } from "@qonaqta/ui/components/button"
import { Input } from "@qonaqta/ui/components/input"
import { apiClient } from "@/shared/api"

interface Branch {
  id: number
  name: string
  address: string
  is_active: boolean
}

interface Restaurant {
  id: number
  name: string
  slug: string
  description: string | null
  created_at: string
  branches?: Branch[]
}

function useRestaurants() {
  return useQuery<Restaurant[]>({
    queryKey: ["hub-restaurants"],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/restaurants")
      return data
    },
  })
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const branchCount = restaurant.branches?.length ?? 0
  const activeBranches = restaurant.branches?.filter((b) => b.is_active).length ?? 0

  return (
    <div className="group relative rounded-2xl border border-neutral-100 bg-white p-5 transition-all hover:border-neutral-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-neutral-900">
            <span className="text-base font-bold text-white">
              {restaurant.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-neutral-900">
              {restaurant.name}
            </h3>
            <p className="mt-0.5 text-xs text-neutral-400">
              {restaurant.slug}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex size-8 items-center justify-center rounded-lg text-neutral-300 opacity-0 transition-all hover:bg-neutral-50 hover:text-neutral-500 group-hover:opacity-100"
          >
            <MoreHorizontal className="size-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-9 z-50 w-44 rounded-xl border border-neutral-100 bg-white py-1.5 shadow-lg">
                <button className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] text-neutral-600 transition-colors hover:bg-neutral-50">
                  <Pencil className="size-3.5" />
                  Редактировать
                </button>
                <button className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] text-neutral-600 transition-colors hover:bg-neutral-50">
                  <Power className="size-3.5" />
                  Деактивировать
                </button>
                <div className="my-1 h-px bg-neutral-100" />
                <button className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] text-red-500 transition-colors hover:bg-red-50">
                  <Trash2 className="size-3.5" />
                  Удалить
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {restaurant.description && (
        <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-neutral-400">
          {restaurant.description}
        </p>
      )}

      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
          <MapPin className="size-3.5" />
          <span>
            {branchCount > 0 ? (
              <>
                <span className="font-medium text-neutral-600">{activeBranches}</span>
                {branchCount !== activeBranches && (
                  <span> из {branchCount}</span>
                )}
                {branchCount === 1 ? " филиал" : " филиалов"}
              </>
            ) : (
              "Нет филиалов"
            )}
          </span>
        </div>
        <span className="text-[11px] text-neutral-300">
          {formatDate(restaurant.created_at)}
        </span>
      </div>

      {branchCount > 0 && (
        <div className="mt-4 flex items-center justify-between border-t border-neutral-50 pt-3.5">
          <div className="flex gap-1.5">
            {restaurant.branches?.slice(0, 3).map((branch) => (
              <span
                key={branch.id}
                className={cn(
                  "rounded-md px-2 py-0.5 text-[11px] font-medium",
                  branch.is_active
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-neutral-50 text-neutral-400"
                )}
              >
                {branch.name}
              </span>
            ))}
            {branchCount > 3 && (
              <span className="rounded-md bg-neutral-50 px-2 py-0.5 text-[11px] text-neutral-400">
                +{branchCount - 3}
              </span>
            )}
          </div>
          <button className="flex items-center gap-1 text-xs font-medium text-neutral-400 transition-colors hover:text-neutral-600">
            Открыть
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white/50 py-24">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-neutral-100">
        <Store className="size-7 text-neutral-300" />
      </div>
      <h3 className="mt-5 text-[15px] font-semibold text-neutral-900">
        Нет ресторанов
      </h3>
      <p className="mt-1.5 max-w-[280px] text-center text-[13px] text-neutral-400">
        Создайте первый бренд и добавьте филиалы чтобы начать работу
      </p>
      <Button className="mt-6 gap-1.5 rounded-xl bg-neutral-900 px-5 text-[13px] text-white hover:bg-neutral-800">
        <Plus className="size-4" />
        Создать бренд
      </Button>
    </div>
  )
}

export function RestaurantsPage() {
  const { data: restaurants, isLoading } = useRestaurants()
  const [search, setSearch] = useState("")

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
          <Button className="gap-1.5 rounded-xl bg-neutral-900 text-[13px] text-white hover:bg-neutral-800">
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
          <EmptyState />
        )
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  )
}
