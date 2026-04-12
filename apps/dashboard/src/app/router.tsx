import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
  Outlet,
} from "@tanstack/react-router"
import { LoginPage } from "@/pages/login"
import { HomePage } from "@/pages/home"

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

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  beforeLoad: () => {
    const token = localStorage.getItem("hub_token")
    if (!token) throw redirect({ to: "/login" })
  },
  component: () => <Outlet />,
})

const indexRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/",
  component: HomePage,
})

const routeTree = rootRoute.addChildren([
  loginRoute,
  protectedRoute.addChildren([indexRoute]),
])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
