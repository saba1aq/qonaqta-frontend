import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from "@tanstack/react-router"

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-svh bg-[#F8F8F8]">
      <Outlet />
    </div>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <div className="flex h-svh items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-[#1C1C1C]">Qonaqta Dashboard</h1>
        <p className="mt-2 text-sm text-[#1C1C1C]/50">Суперадмин панель — hub.qonaqta.kz</p>
      </div>
    </div>
  ),
})

const routeTree = rootRoute.addChildren([indexRoute])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
