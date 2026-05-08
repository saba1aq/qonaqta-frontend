import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
import { MobileLayout } from './providers/mobile-layout'
import { HomePage } from '@/pages/home'
import { RestaurantPage } from '@/pages/restaurant'
import { BookingPage, ConfirmPage } from '@/pages/booking'
import { ProfilePage } from '@/pages/profile'
import { AuthPage } from '@/pages/auth'

const rootRoute = createRootRoute({
  component: () => (
    <MobileLayout>
      <Outlet />
    </MobileLayout>
  ),
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const restaurantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/restaurant/$id',
  component: RestaurantPage,
})

const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/restaurant/$id/book',
  component: BookingPage,
})

const confirmRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/restaurant/$id/book/confirm',
  component: ConfirmPage,
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
})

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: AuthPage,
})

const routeTree = rootRoute.addChildren([
  homeRoute,
  restaurantRoute,
  bookingRoute,
  confirmRoute,
  profileRoute,
  authRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
