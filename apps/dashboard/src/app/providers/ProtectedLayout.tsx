import { useState } from "react"
import { Outlet } from "@tanstack/react-router"
import { AdminLayout } from "@/widgets/admin-layout"

export function ProtectedLayout() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <AdminLayout collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)}>
      <Outlet />
    </AdminLayout>
  )
}
