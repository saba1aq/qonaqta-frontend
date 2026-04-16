import { useState } from "react"
import { Plus, Users as UsersIcon } from "lucide-react"
import { Button } from "@qonaqta/ui/components/button"
import { useStaffByBrand, StaffRow, type Staff } from "@/features/staff"
import { CreateAdminModal } from "./CreateAdminModal"
import { EditAdminModal } from "./EditAdminModal"

export function AdminsTab({ brandId }: { brandId: number }) {
  const { data: staff, isLoading } = useStaffByBrand(brandId)
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<Staff | null>(null)

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-neutral-400">
          {staff?.length
            ? `${staff.length} ${staff.length === 1 ? "админ" : "админов"}`
            : "Админы бренда"}
        </p>
        {staff && staff.length > 0 && (
          <Button
            onClick={() => setShowCreate(true)}
            className="gap-1.5 rounded-xl bg-neutral-900 text-[13px] text-white hover:bg-neutral-800"
          >
            <Plus className="size-4" />
            Добавить админа
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-[60px] animate-pulse rounded-xl bg-neutral-100" />
          ))}
        </div>
      ) : !staff || staff.length === 0 ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white/50 py-16">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-neutral-100">
            <UsersIcon className="size-6 text-neutral-300" />
          </div>
          <h3 className="mt-4 text-[14px] font-semibold text-neutral-900">
            Нет админов
          </h3>
          <p className="mt-1 max-w-[300px] text-center text-[12px] text-neutral-400">
            Добавьте админа — он сможет войти в partner.qonaqta.kz и настраивать филиалы
          </p>
          <Button
            onClick={() => setShowCreate(true)}
            className="mt-5 gap-1.5 rounded-xl bg-neutral-900 px-4 text-[13px] text-white hover:bg-neutral-800"
          >
            <Plus className="size-4" />
            Добавить админа
          </Button>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {staff.map((s) => (
            <StaffRow key={s.id} staff={s} onEdit={() => setEditing(s)} />
          ))}
        </div>
      )}

      {showCreate && <CreateAdminModal brandId={brandId} onClose={() => setShowCreate(false)} />}
      {editing && <EditAdminModal staff={editing} onClose={() => setEditing(null)} />}
    </div>
  )
}
