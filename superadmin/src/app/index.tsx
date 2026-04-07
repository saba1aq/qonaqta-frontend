import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "@tanstack/react-router"
import { QueryProvider } from "./providers/query-provider"
import { router } from "./router"
import { useAuthStore } from "@/entities/user"
import "./styles/index.css"

useAuthStore.getState().loadFromStorage()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>
)
