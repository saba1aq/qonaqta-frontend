import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
  Outlet,
} from "@tanstack/react-router"
import { useState, type ReactNode } from "react"
import { LoginPage } from "@/pages/login"
import { DashboardPage } from "@/pages/dashboard"
import { ReservationsPage } from "@/pages/reservations"
import { SettingsPage } from "@/pages/settings"
import { AdminLayout } from "@/widgets/admin-layout"

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
})

function ProtectedLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <AdminLayout collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)}>
      {children}
    </AdminLayout>
  )
}

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  beforeLoad: () => {
    const token = localStorage.getItem("admin_token")
    if (!token) throw redirect({ to: "/login" })
  },
  component: () => (
    <ProtectedLayout>
      <Outlet />
    </ProtectedLayout>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: DashboardPage,
})

const bookingsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/bookings",
  component: ReservationsPage,
})

const settingsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/settings",
  component: SettingsPage,
})

const routeTree = rootRoute.addChildren([
  loginRoute,
  layoutRoute.addChildren([
    indexRoute,
    bookingsRoute,
    settingsRoute,
  ]),
])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
