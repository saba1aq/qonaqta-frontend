import type { ReactNode } from 'react'

interface MobileLayoutProps {
  children: ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[480px] bg-white min-h-screen relative shadow-sm">
        {children}
      </div>
    </div>
  )
}
