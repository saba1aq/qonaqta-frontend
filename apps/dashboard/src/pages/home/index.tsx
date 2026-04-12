import { useAuthStore } from "@/entities/user"
import { Button } from "@qonaqta/ui/components/button"

export function HomePage() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="flex min-h-svh items-center justify-center bg-neutral-50">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-neutral-900">Qonaqta Hub</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Добро пожаловать, {user?.first_name ?? user?.phone}
        </p>
        <Button
          onClick={() => {
            logout()
            window.location.href = "/login"
          }}
          variant="outline"
          className="mt-6"
        >
          Выйти
        </Button>
      </div>
    </div>
  )
}
