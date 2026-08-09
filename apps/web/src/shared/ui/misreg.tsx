import type { ReactNode } from 'react'

export function Misreg({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span className={`relative inline-block isolate ${className}`}>
      {children}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 mix-blend-multiply text-lilac translate-x-[4px] translate-y-[3px] motion-reduce:translate-x-[3px] motion-reduce:translate-y-[2px]"
      >
        {children}
      </span>
    </span>
  )
}
