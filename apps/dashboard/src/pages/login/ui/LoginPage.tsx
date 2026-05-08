import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { Button } from "@qonaqta/ui/components/button"
import { Input } from "@qonaqta/ui/components/input"
import { Label } from "@qonaqta/ui/components/label"
import { Phone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { apiClient } from "@/shared/api"
import { useAuthStore } from "@/entities/user"

export function LoginPage() {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length === 0) return ""
    if (digits.length <= 1) return `+${digits}`
    if (digits.length <= 4) return `+${digits.slice(0, 1)} (${digits.slice(1)}`
    if (digits.length <= 7)
      return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4)}`
    if (digits.length <= 9)
      return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
    return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const digits = phone.replace(/\D/g, "")
      const normalizedPhone = digits.startsWith("7") ? `+${digits}` : phone
      const { data } = await apiClient.post("/api/v1/auth/login", {
        phone: normalizedPhone,
        password,
      })
      if (data.user.role !== "superadmin") {
        toast.error("Доступ только для суперадминистраторов")
        setIsLoading(false)
        return
      }
      login(data.access_token, data.user)
      navigate({ to: "/" })
    } catch {
      toast.error("Неверный номер телефона или пароль")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-neutral-50">
      <div className="w-full max-w-[380px] px-6">
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 shadow-lg shadow-neutral-900/20">
              <span className="text-lg font-bold tracking-tight text-white">Q</span>
            </div>
          </div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-neutral-900">
            Qonaqta Hub
          </h1>
          <p className="mt-1.5 text-[13px] text-neutral-400">
            Панель суперадминистратора
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[13px] text-neutral-600">Номер телефона</Label>
            <div className="relative">
              <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
              <Input
                type="tel"
                placeholder="+7 (700) 000-00-00"
                value={phone}
                onChange={handlePhoneChange}
                className="h-10 rounded-xl border-neutral-200 bg-white pl-9 text-[14px] text-neutral-900 placeholder:text-neutral-300 focus-visible:border-neutral-400 focus-visible:ring-neutral-400/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[13px] text-neutral-600">Пароль</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 rounded-xl border-neutral-200 bg-white pr-10 pl-9 text-[14px] text-neutral-900 placeholder:text-neutral-300 focus-visible:border-neutral-400 focus-visible:ring-neutral-400/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !phone || !password}
            className="h-10 w-full rounded-xl bg-neutral-900 text-[14px] font-medium text-white shadow-lg shadow-neutral-900/20 transition-all hover:bg-neutral-800 hover:shadow-neutral-900/30 disabled:opacity-40 disabled:shadow-none"
          >
            {isLoading ? (
              <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                Войти
                <ArrowRight className="ml-1 size-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-[12px] text-neutral-300">
          Доступ только для суперадминистраторов
        </p>
      </div>
    </div>
  )
}
