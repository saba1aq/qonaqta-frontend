import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
  Outlet,
} from "@tanstack/react-router"
import { LoginPage } from "@/pages/login"
import { DashboardPage } from "@/pages/dashboard"
import { ReservationsPage } from "@/pages/reservations"
import { SettingsPage } from "@/pages/settings"
import { ProtectedLayout } from "./providers/ProtectedLayout"

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
})

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  beforeLoad: () => {
    const token = localStorage.getItem("admin_token")
    if (!token) throw redirect({ to: "/login" })
  },
  component: ProtectedLayout,
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
