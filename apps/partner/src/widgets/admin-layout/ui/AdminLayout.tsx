import { type ReactNode } from "react"
import { Sidebar } from "@/widgets/sidebar"
import { cn } from "@qonaqta/ui/lib/utils"

interface AdminLayoutProps {
  collapsed: boolean
  onToggle: () => void
  children: ReactNode
}

export function AdminLayout({ collapsed, onToggle, children }: AdminLayoutProps) {
  return (
    <div className="min-h-svh bg-neutral-50">
      <Sidebar collapsed={collapsed} onToggle={onToggle} />
      <main
        className={cn(
          "min-h-svh transition-all duration-300",
          collapsed ? "pl-[68px]" : "pl-[240px]"
        )}
      >
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
