import { Link, useRouterState } from "@tanstack/react-router"
import {
  LayoutDashboard,
  CalendarCheck,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@qonaqta/ui/lib/utils"
import { Avatar, AvatarFallback } from "@qonaqta/ui/components/avatar"
import { useAuthStore } from "@/entities/user"
import { useRouter } from "@tanstack/react-router"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  { path: "/", label: "Дашборд", icon: LayoutDashboard, exact: true },
  { path: "/bookings", label: "Брони", icon: CalendarCheck, exact: false },
  { path: "/settings", label: "Настройки", icon: Settings, exact: false },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { logout, user } = useAuthStore()
  const router = useRouter()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const isActive = (path: string, exact: boolean) => {
    if (exact) return currentPath === path
    return currentPath === path || currentPath.startsWith(path + "/")
  }

  const handleLogout = () => {
    logout()
    router.navigate({ to: "/login" })
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "АК"

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-neutral-200 bg-white transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center border-b border-neutral-200 px-4",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900">
            <span className="text-sm font-bold text-white">Q</span>
          </div>
          {!collapsed && (
            <span className="text-[14px] font-semibold tracking-[-0.02em] text-neutral-900">
              Qonaqta
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={onToggle}
            className="flex size-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
          >
            <ChevronLeft className="size-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={onToggle}
          className="mx-auto mt-3 flex size-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
        >
          <ChevronLeft className="size-4 rotate-180" />
        </button>
      )}

      <nav className="mt-3 flex-1 space-y-0.5 px-2.5">
        {navItems.map(({ path, label, icon: Icon, exact }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] transition-colors",
              collapsed && "justify-center px-0",
              isActive(path, exact)
                ? "bg-neutral-100 font-medium text-neutral-900"
                : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
            )}
          >
            <Icon className="size-[18px] shrink-0" />
            {!collapsed && label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-neutral-200 p-2.5">
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-xl px-3 py-2",
            collapsed && "justify-center px-0"
          )}
        >
          <Avatar className="size-8 border border-neutral-200">
            <AvatarFallback className="bg-neutral-100 text-[11px] text-neutral-600">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-neutral-900">
                {user?.name ?? "Админ"}
              </p>
              <p className="truncate text-[11px] text-neutral-400">
                {user?.phone ?? ""}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="flex size-7 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-red-500"
            >
              <LogOut className="size-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
