import { type ReactNode } from "react"
import { Link, useLocation } from "@tanstack/react-router"
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  MapPin,
  ChefHat,
  CalendarCheck,
  LogOut,
} from "lucide-react"
import { Button } from "@/shared/ui/button"
import { useAuthStore } from "@/entities/user"
import { cn } from "@/shared/lib/utils"

const navItems = [
  { to: "/", label: "Дашборд", icon: LayoutDashboard },
  { to: "/restaurants", label: "Рестораны", icon: UtensilsCrossed },
  { to: "/users", label: "Пользователи", icon: Users },
  { to: "/cities", label: "Города", icon: MapPin },
  { to: "/cuisines", label: "Кухни", icon: ChefHat },
  { to: "/bookings", label: "Бронирования", icon: CalendarCheck },
] as const

export function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { user, logout } = useAuthStore()

  return (
    <div className="flex h-screen">
      <aside className="bg-sidebar text-sidebar-foreground flex w-64 flex-col border-r">
        <div className="border-b p-6">
          <h1 className="text-xl font-bold tracking-tight">Qonaqta</h1>
          <p className="text-muted-foreground text-xs">Superadmin Panel</p>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="text-muted-foreground truncate text-xs">
                {user?.phone}
              </p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={logout}>
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
