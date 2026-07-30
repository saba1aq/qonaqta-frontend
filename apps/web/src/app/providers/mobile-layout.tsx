import type { ReactNode } from 'react'
import { Masthead } from '@/widgets/masthead'

interface RootLayoutProps {
  children: ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-svh flex flex-col">
      <Masthead />
      <div className="flex-1">{children}</div>
    </div>
  )
}
