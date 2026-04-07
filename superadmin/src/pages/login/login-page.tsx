import { useState, type FormEvent } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card"
import { useAuthStore } from "@/entities/user"
import { apiClient } from "@/shared/api"

export function LoginPage() {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { data } = await apiClient.post("/admin/auth/login", {
        phone,
        password,
      })
      login(data.access_token, data.user)
      navigate({ to: "/" })
    } catch {
      setError("Неверный номер телефона или пароль")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Qonaqta</CardTitle>
          <CardDescription>Вход в панель суперадмина</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Номер телефона</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (700) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Вход..." : "Войти"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
