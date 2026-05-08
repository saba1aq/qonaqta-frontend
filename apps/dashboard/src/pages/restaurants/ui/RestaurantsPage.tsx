import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { Plus, Search, Store, Pencil, Trash2 } from "lucide-react"
import { Input } from "@qonaqta/ui/components/input"
import {
  useRestaurants,
  useDeleteRestaurant,
  useUpdateRestaurant,
} from "@/features/restaurants"

export function RestaurantsPage() {
  const { data: restaurants, isLoading } = useRestaurants()
  const navigate = useNavigate()
  const deleteMutation = useDeleteRestaurant()
  const updateMutation = useUpdateRestaurant()
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
              ? `${restaurants.length} на платформе`
              : "Управление ресторанами"}
          </p>
        </div>
        <Link
          to="/restaurants/create"
          className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-neutral-800"
        >
          <Plus className="size-4" />
          Добавить
        </Link>
      </div>

      {restaurants && restaurants.length > 0 && (
        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-300" />
          <Input
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-xl border-neutral-200 bg-white pl-10 text-[13px] placeholder:text-neutral-300 focus-visible:border-neutral-300 focus-visible:ring-neutral-200/50"
          />
        </div>
      )}

      {isLoading ? (
        <div className="mt-6 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[52px] animate-pulse rounded-xl bg-neutral-100" />
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
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white/50 py-24">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-neutral-100">
              <Store className="size-7 text-neutral-300" />
            </div>
            <h3 className="mt-5 text-[15px] font-semibold text-neutral-900">
              Нет ресторанов
            </h3>
            <p className="mt-1.5 max-w-[280px] text-center text-[13px] text-neutral-400">
              Добавьте первый ресторан чтобы начать работу
            </p>
            <Link
              to="/restaurants/create"
              className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-5 py-2 text-[13px] font-medium text-white hover:bg-neutral-800"
            >
              <Plus className="size-4" />
              Добавить
            </Link>
          </div>
        )
      ) : (
        <div className="mt-6 bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                <th className="text-left px-4 py-3 font-medium text-neutral-500 w-16">ID</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Название</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Город</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Адрес</th>
                <th className="text-center px-4 py-3 font-medium text-neutral-500 w-24">Статус</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => navigate({ to: "/restaurants/$id", params: { id: String(r.id) } })}
                  className="border-b border-neutral-50 hover:bg-neutral-50/50 cursor-pointer"
                >
                  <td className="px-4 py-3 text-neutral-400 tabular-nums">{r.id}</td>
                  <td className="px-4 py-3 font-medium text-neutral-900">{r.name}</td>
                  <td className="px-4 py-3 text-neutral-500">{r.city?.name || "—"}</td>
                  <td className="px-4 py-3 text-neutral-500 truncate max-w-[200px]">{r.address || "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        updateMutation.mutate({ id: r.id, payload: { is_active: !r.is_active } })
                      }}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                        r.is_active ? "bg-neutral-900" : "bg-neutral-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm ring-0 transition-transform ${
                          r.is_active ? "translate-x-4" : "translate-x-0.5"
                        } mt-0.5`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate({ to: "/restaurants/$id", params: { id: String(r.id) } })
                        }}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm("Удалить ресторан?")) deleteMutation.mutate(r.id)
                        }}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
