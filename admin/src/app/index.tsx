import "@/app/styles/index.css"
import { useEffect } from "react"
import { RouterProvider } from "@tanstack/react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import { router } from "./router"
import { useAuthStore } from "@/entities/user"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
})

function AppInit() {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage)
  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])
  return <RouterProvider router={router} />
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInit />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  )
}
