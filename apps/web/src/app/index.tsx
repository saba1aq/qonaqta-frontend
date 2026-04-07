import { RouterProvider } from '@tanstack/react-router'
import { QueryProvider } from './providers/query-provider'
import { router } from './router'
import { useAuthStore } from '@/entities/user'
import { useEffect } from 'react'

export function App() {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage)

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  )
}
