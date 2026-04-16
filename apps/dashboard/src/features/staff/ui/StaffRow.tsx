import { Pencil, Trash2 } from "lucide-react"
import { useDeleteStaff } from "../api"
import type { Staff } from "../model/types"
import { ROLE_COLORS, ROLE_LABELS } from "../model/types"

export function StaffRow({
  staff,
  onEdit,
}: {
  staff: Staff
  onEdit: () => void
}) {
  const deleteMutation = useDeleteStaff(staff.brand_id)

  const initials = (staff.first_name[0] + (staff.last_name[0] ?? "")).toUpperCase()

  return (
    <div className="group flex items-center gap-4 rounded-xl border border-neutral-100 bg-white px-4 py-3 transition-all hover:border-neutral-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-100">
        <span className="text-[12px] font-semibold text-neutral-600">{initials}</span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium text-neutral-900">
          {staff.first_name} {staff.last_name}
        </p>
        <p className="mt-0.5 truncate text-[12px] text-neutral-400">
          {staff.phone}
        </p>
      </div>

      <span
        className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${ROLE_COLORS[staff.role]}`}
      >
        {ROLE_LABELS[staff.role]}
      </span>

      <div className="flex items-center gap-1 opacity-0 transition-all group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="flex size-8 items-center justify-center rounded-lg text-neutral-300 transition-all hover:bg-neutral-50 hover:text-neutral-600"
        >
          <Pencil className="size-4" />
        </button>
        <button
          onClick={() => deleteMutation.mutate(staff.id)}
          disabled={deleteMutation.isPending}
          className="flex size-8 items-center justify-center rounded-lg text-neutral-300 transition-all hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  )
}
