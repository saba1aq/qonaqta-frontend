import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
  Outlet,
} from "@tanstack/react-router"
import { LoginPage } from "@/pages/login"
import { BrandsPage } from "@/pages/brands"
import { BrandDetailPage } from "@/pages/brand-detail"
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
    throw redirect({ to: "/brands" })
  },
})

const brandsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/brands",
  component: BrandsPage,
})

const brandDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/brands/$brandId",
  component: BrandDetailPage,
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
    brandsRoute,
    brandDetailRoute,
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
