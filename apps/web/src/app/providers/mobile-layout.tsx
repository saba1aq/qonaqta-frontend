import type { ReactNode } from 'react'

interface MobileLayoutProps {
  children: ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-svh bg-gray-100 flex justify-center">
      <div className="w-full max-w-[480px] bg-white min-h-svh relative shadow-sm">
        {children}
      </div>
    </div>
  )
}
