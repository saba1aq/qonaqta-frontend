import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
  Outlet,
} from "@tanstack/react-router"
import { AdminLayout } from "@/widgets/admin-layout"
import { LoginPage } from "@/pages/login"
import { DashboardPage } from "@/pages/dashboard"
import { RestaurantsPage } from "@/pages/restaurants"
import { UsersPage } from "@/pages/users"
import { CitiesPage } from "@/pages/cities"
import { CuisinesPage } from "@/pages/cuisines"
import { BookingsPage } from "@/pages/bookings"

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
  beforeLoad: () => {
    const token = localStorage.getItem("token")
    if (token) {
      throw redirect({ to: "/" })
    }
  },
})

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "authenticated",
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
  beforeLoad: () => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw redirect({ to: "/login" })
    }
  },
})

const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/",
  component: DashboardPage,
})

const restaurantsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/restaurants",
  component: RestaurantsPage,
})

const usersRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/users",
  component: UsersPage,
})

const citiesRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/cities",
  component: CitiesPage,
})

const cuisinesRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/cuisines",
  component: CuisinesPage,
})

const bookingsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/bookings",
  component: BookingsPage,
})

const routeTree = rootRoute.addChildren([
  loginRoute,
  authenticatedRoute.addChildren([
    dashboardRoute,
    restaurantsRoute,
    usersRoute,
    citiesRoute,
    cuisinesRoute,
    bookingsRoute,
  ]),
])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
