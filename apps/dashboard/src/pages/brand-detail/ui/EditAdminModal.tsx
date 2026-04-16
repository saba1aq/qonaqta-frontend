import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@qonaqta/ui/components/button"
import { Input } from "@qonaqta/ui/components/input"
import { Label } from "@qonaqta/ui/components/label"
import { Switch } from "@qonaqta/ui/components/switch"
import {
  useUpdateStaff,
  ROLE_LABELS,
  type Staff,
  type StaffRole,
  type UpdateStaffPayload,
} from "@/features/staff"

const ROLES: StaffRole[] = ["owner", "manager", "host"]

export function EditAdminModal({ staff, onClose }: { staff: Staff; onClose: () => void }) {
  const [firstName, setFirstName] = useState(staff.first_name)
  const [lastName, setLastName] = useState(staff.last_name)
  const [role, setRole] = useState<StaffRole>(staff.role)
  const [isActive, setIsActive] = useState(staff.is_active)

  const updateMutation = useUpdateStaff(staff.brand_id, onClose)

  const handleSave = () => {
    const payload: UpdateStaffPayload = {}
    if (firstName !== staff.first_name) payload.first_name = firstName
    if (lastName !== staff.last_name) payload.last_name = lastName
    if (role !== staff.role) payload.role = role
    if (isActive !== staff.is_active) payload.is_active = isActive
    updateMutation.mutate({ id: staff.id, payload })
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Редактировать админа</h2>
            <button onClick={onClose} className="flex size-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-50">
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Телефон</Label>
              <Input value={staff.phone} disabled className="h-10 rounded-xl text-[13px]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[13px] text-neutral-600">Имя</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-10 rounded-xl text-[13px]" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] text-neutral-600">Фамилия</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-10 rounded-xl text-[13px]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Роль</Label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`rounded-lg border px-3 py-2 text-[13px] font-medium transition-colors ${
                      role === r
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {ROLE_LABELS[r]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-neutral-100 px-4 py-3">
              <Label className="text-[13px] text-neutral-600">Активен</Label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl text-[13px]">
              Отмена
            </Button>
            <Button
              disabled={!firstName || updateMutation.isPending}
              onClick={handleSave}
              className="flex-1 rounded-xl bg-neutral-900 text-[13px] text-white hover:bg-neutral-800"
            >
              {updateMutation.isPending ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
