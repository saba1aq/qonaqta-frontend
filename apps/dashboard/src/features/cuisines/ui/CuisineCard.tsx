import { Check, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@qonaqta/ui/components/badge"
import { useDeleteCuisine, useToggleCuisineActive } from "../api"
import type { Cuisine } from "../model/types"

export function CuisineCard({ cuisine, onEdit }: { cuisine: Cuisine; onEdit: () => void }) {
  const deleteMutation = useDeleteCuisine()
  const toggleActiveMutation = useToggleCuisineActive()

  return (
    <div className="group flex items-center justify-between rounded-xl border border-neutral-100 bg-white px-4 py-3 transition-all hover:border-neutral-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3">
        <button
          onClick={() => toggleActiveMutation.mutate({ id: cuisine.id, is_active: !cuisine.is_active })}
          disabled={toggleActiveMutation.isPending}
          className={`flex size-5 shrink-0 items-center justify-center rounded border transition-colors ${
            cuisine.is_active
              ? "border-neutral-900 bg-neutral-900"
              : "border-neutral-300 bg-white hover:border-neutral-400"
          }`}
        >
          {cuisine.is_active && <Check className="size-3.5 text-white" />}
        </button>
        <div>
          <p className={`text-[14px] font-medium ${cuisine.is_active ? "text-neutral-900" : "text-neutral-400 line-through"}`}>
            {cuisine.name}
          </p>
          <Badge variant="secondary" className="mt-0.5 text-[11px] font-normal text-neutral-400">
            {cuisine.slug}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 transition-all group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="flex size-8 items-center justify-center rounded-lg text-neutral-300 transition-all hover:bg-neutral-50 hover:text-neutral-600"
        >
          <Pencil className="size-4" />
        </button>
        <button
          onClick={() => deleteMutation.mutate(cuisine.id)}
          disabled={deleteMutation.isPending}
          className="flex size-8 items-center justify-center rounded-lg text-neutral-300 transition-all hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  )
}
