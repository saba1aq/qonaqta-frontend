import type { ReactNode } from 'react'

const COLORS: Record<string, string> = {
  blue: '#2331b4',
  pink: '#f2315d',
  sun: '#f4b71a',
}

export function Misreg({
  children,
  color = 'blue',
  className = '',
}: {
  children: ReactNode
  color?: 'blue' | 'pink' | 'sun'
  className?: string
}) {
  return (
    <span className={`relative inline-block isolate ${className}`}>
      {children}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 mix-blend-multiply opacity-40 translate-x-[4px] translate-y-[3px] motion-reduce:translate-x-[3px] motion-reduce:translate-y-[2px]"
        style={{ color: COLORS[color] }}
      >
        {children}
      </span>
    </span>
  )
}
