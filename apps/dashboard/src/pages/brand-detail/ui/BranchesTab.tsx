import { useState } from "react"
import { Plus, MapPin } from "lucide-react"
import { Button } from "@qonaqta/ui/components/button"
import { useBranchesByBrand, BranchRow, type Branch } from "@/features/branches"
import { CreateBranchModal } from "./CreateBranchModal"
import { EditBranchModal } from "./EditBranchModal"

export function BranchesTab({ brandId }: { brandId: number }) {
  const { data: branches, isLoading } = useBranchesByBrand(brandId)
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<Branch | null>(null)

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-neutral-400">
          {branches?.length
            ? `${branches.length} ${branches.length === 1 ? "филиал" : "филиалов"}`
            : "Филиалы бренда"}
        </p>
        {branches && branches.length > 0 && (
          <Button
            onClick={() => setShowCreate(true)}
            className="gap-1.5 rounded-xl bg-neutral-900 text-[13px] text-white hover:bg-neutral-800"
          >
            <Plus className="size-4" />
            Добавить филиал
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-[60px] animate-pulse rounded-xl bg-neutral-100" />
          ))}
        </div>
      ) : !branches || branches.length === 0 ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white/50 py-16">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-neutral-100">
            <MapPin className="size-6 text-neutral-300" />
          </div>
          <h3 className="mt-4 text-[14px] font-semibold text-neutral-900">
            Нет филиалов
          </h3>
          <p className="mt-1 max-w-[280px] text-center text-[12px] text-neutral-400">
            Добавьте первый филиал, чтобы его можно было забронировать
          </p>
          <Button
            onClick={() => setShowCreate(true)}
            className="mt-5 gap-1.5 rounded-xl bg-neutral-900 px-4 text-[13px] text-white hover:bg-neutral-800"
          >
            <Plus className="size-4" />
            Добавить филиал
          </Button>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {branches.map((branch) => (
            <BranchRow key={branch.id} branch={branch} onEdit={() => setEditing(branch)} />
          ))}
        </div>
      )}

      {showCreate && <CreateBranchModal brandId={brandId} onClose={() => setShowCreate(false)} />}
      {editing && <EditBranchModal branch={editing} onClose={() => setEditing(null)} />}
    </div>
  )
}
