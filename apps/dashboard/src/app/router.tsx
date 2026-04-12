import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
  Outlet,
} from "@tanstack/react-router"
import { LoginPage } from "@/pages/login"
import { RestaurantsPage } from "@/pages/restaurants"
import { BookingsPage } from "@/pages/bookings"
import { UsersPage } from "@/pages/users"
import { ProtectedLayout } from "./providers/ProtectedLayout"

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-svh bg-neutral-50">
      <Outlet />
    </div>
  ),
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
    const token = localStorage.getItem("hub_token")
    if (!token) throw redirect({ to: "/login" })
  },
  component: ProtectedLayout,
})

const restaurantsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: RestaurantsPage,
})

const bookingsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/bookings",
  component: BookingsPage,
})

const usersRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/users",
  component: UsersPage,
})

const routeTree = rootRoute.addChildren([
  loginRoute,
  layoutRoute.addChildren([restaurantsRoute, bookingsRoute, usersRoute]),
])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
