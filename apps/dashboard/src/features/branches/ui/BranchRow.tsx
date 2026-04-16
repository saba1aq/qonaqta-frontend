import { MapPin, Phone, Pencil, Trash2 } from "lucide-react"
import { useDeleteBranch } from "../api"
import type { Branch } from "../model/types"

export function BranchRow({
  branch,
  onEdit,
}: {
  branch: Branch
  onEdit: () => void
}) {
  const deleteMutation = useDeleteBranch(branch.brand_id)

  return (
    <div className="group flex items-center gap-4 rounded-xl border border-neutral-100 bg-white px-4 py-3 transition-all hover:border-neutral-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
        <MapPin className="size-4 text-neutral-500" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={`truncate text-[14px] font-medium ${branch.is_active ? "text-neutral-900" : "text-neutral-400"}`}>
            {branch.name}
          </p>
          {!branch.is_active && (
            <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">
              неактивен
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-[12px] text-neutral-400">
          {branch.address}
        </p>
      </div>

      {branch.phone && (
        <div className="hidden items-center gap-1.5 text-[12px] text-neutral-400 md:flex">
          <Phone className="size-3.5" />
          <span>{branch.phone}</span>
        </div>
      )}

      <div className="flex items-center gap-1 opacity-0 transition-all group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="flex size-8 items-center justify-center rounded-lg text-neutral-300 transition-all hover:bg-neutral-50 hover:text-neutral-600"
        >
          <Pencil className="size-4" />
        </button>
        <button
          onClick={() => deleteMutation.mutate(branch.id)}
          disabled={deleteMutation.isPending}
          className="flex size-8 items-center justify-center rounded-lg text-neutral-300 transition-all hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  )
}
