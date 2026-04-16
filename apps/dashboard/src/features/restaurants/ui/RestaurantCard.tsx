import { useState } from "react"
import { MapPin, ChevronRight, MoreHorizontal, Pencil, Power, Trash2 } from "lucide-react"
import { cn } from "@qonaqta/ui/lib/utils"
import { formatDate } from "@/shared/lib/format-date"
import { useDeleteRestaurant } from "../api"
import type { Restaurant } from "../model/types"

export function RestaurantCard({ restaurant, onEdit }: { restaurant: Restaurant; onEdit: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const branchCount = restaurant.branches?.length ?? 0
  const activeBranches = restaurant.branches?.filter((b) => b.is_active).length ?? 0

  const deleteMutation = useDeleteRestaurant()

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
                <button
                  onClick={() => { onEdit(); setMenuOpen(false) }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] text-neutral-600 transition-colors hover:bg-neutral-50"
                >
                  <Pencil className="size-3.5" />
                  Редактировать
                </button>
                <button
                  onClick={() => { setMenuOpen(false) }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] text-neutral-600 transition-colors hover:bg-neutral-50"
                >
                  <Power className="size-3.5" />
                  Деактивировать
                </button>
                <div className="my-1 h-px bg-neutral-100" />
                <button
                  onClick={() => { deleteMutation.mutate(restaurant.id); setMenuOpen(false) }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] text-red-500 transition-colors hover:bg-red-50"
                >
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
                {branchCount !== activeBranches && <span> из {branchCount}</span>}
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
