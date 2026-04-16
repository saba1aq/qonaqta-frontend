import { useState } from "react"
import { X, Eye, EyeOff, KeyRound } from "lucide-react"
import { Button } from "@qonaqta/ui/components/button"
import { Input } from "@qonaqta/ui/components/input"
import { Label } from "@qonaqta/ui/components/label"
import { useCreateStaff, ROLE_LABELS, type StaffRole } from "@/features/staff"

const ROLES: StaffRole[] = ["owner", "manager", "host"]

function generatePassword(): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789"
  let result = ""
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  const d = digits.startsWith("7") ? digits : "7" + digits.replace(/^[78]/, "")
  let formatted = "+7"
  if (d.length > 1) formatted += " (" + d.slice(1, 4)
  if (d.length > 4) formatted += ") " + d.slice(4, 7)
  if (d.length > 7) formatted += "-" + d.slice(7, 9)
  if (d.length > 9) formatted += "-" + d.slice(9, 11)
  return formatted
}

export function CreateAdminModal({ brandId, onClose }: { brandId: number; onClose: () => void }) {
  const [phone, setPhone] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<StaffRole>("manager")

  const createMutation = useCreateStaff(brandId, onClose)

  const canSubmit = phone.replace(/\D/g, "").length === 11 && firstName.trim() && password.length >= 6

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Добавить админа</h2>
            <button onClick={onClose} className="flex size-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-50">
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Телефон</Label>
              <Input
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className="h-10 rounded-xl text-[13px]"
                type="tel"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[13px] text-neutral-600">Имя</Label>
                <Input
                  placeholder="Алишер"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-10 rounded-xl text-[13px]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] text-neutral-600">Фамилия</Label>
                <Input
                  placeholder="Нурым"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-10 rounded-xl text-[13px]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[13px] text-neutral-600">Пароль</Label>
                <button
                  onClick={() => { setPassword(generatePassword()); setShowPassword(true) }}
                  className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900"
                >
                  <KeyRound className="size-3" />
                  Сгенерировать
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Минимум 6 символов"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 rounded-xl pr-10 text-[13px] font-mono"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
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
              <p className="text-[11px] text-neutral-400">
                {role === "owner" && "Полный доступ к бренду и филиалам"}
                {role === "manager" && "Управление бронями, меню и настройками филиалов"}
                {role === "host" && "Только управление бронями"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl text-[13px]">
              Отмена
            </Button>
            <Button
              disabled={!canSubmit || createMutation.isPending}
              onClick={() =>
                createMutation.mutate({
                  phone,
                  first_name: firstName,
                  last_name: lastName,
                  password,
                  role,
                })
              }
              className="flex-1 rounded-xl bg-neutral-900 text-[13px] text-white hover:bg-neutral-800"
            >
              {createMutation.isPending ? "Создание..." : "Создать"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
