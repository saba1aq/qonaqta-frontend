import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
  Outlet,
} from "@tanstack/react-router"
import { LoginPage } from "@/pages/login"
import { RestaurantsPage } from "@/pages/restaurants"
import { RestaurantDetailPage } from "@/pages/restaurant-detail"
import { RestaurantCreatePage } from "@/pages/restaurant-create"
import { BookingsPage } from "@/pages/bookings"
import { CuisinesPage } from "@/pages/cuisines"
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

const indexRedirectRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/restaurants" })
  },
})

const restaurantsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/restaurants",
  component: RestaurantsPage,
})

const restaurantCreateRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/restaurants/create",
  component: RestaurantCreatePage,
})

const restaurantDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/restaurants/$id",
  component: RestaurantDetailPage,
})

const bookingsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/bookings",
  component: BookingsPage,
})

const cuisinesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/cuisines",
  component: CuisinesPage,
})

const routeTree = rootRoute.addChildren([
  loginRoute,
  layoutRoute.addChildren([
    indexRedirectRoute,
    restaurantsRoute,
    restaurantCreateRoute,
    restaurantDetailRoute,
    bookingsRoute,
    cuisinesRoute,
  ]),
])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
