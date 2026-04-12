import { cn } from "@qonaqta/ui/lib/utils"
import { Sidebar } from "@/widgets/sidebar"

interface AdminLayoutProps {
  collapsed: boolean
  onToggle: () => void
  children: React.ReactNode
}

export function AdminLayout({ collapsed, onToggle, children }: AdminLayoutProps) {
  return (
    <div className="min-h-svh bg-[#F8F8F8]">
      <Sidebar collapsed={collapsed} onToggle={onToggle} />
      <main
        className={cn(
          "min-h-svh transition-all duration-300 p-6 lg:p-8",
          collapsed ? "ml-[68px]" : "ml-[240px]"
        )}
      >
        {children}
      </main>
    </div>
  )
}
