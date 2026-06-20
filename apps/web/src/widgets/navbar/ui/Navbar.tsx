import { useState } from 'react'
import { Home, Heart, User } from 'lucide-react'

type Tab = 'home' | 'favorites' | 'profile'

const TABS: { id: Tab; label: string; Icon: typeof Home }[] = [
  { id: 'home', label: 'Главная', Icon: Home },
  { id: 'favorites', label: 'Избранное', Icon: Heart },
  { id: 'profile', label: 'Профиль', Icon: User },
]

export function Navbar() {
  const [active, setActive] = useState<Tab>('home')

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-[480px] mx-auto bg-white border-t border-neutral-100 pb-[env(safe-area-inset-bottom)]">
      <div className="flex">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors"
            >
              <Icon
                className={`size-6 transition-colors ${
                  isActive ? 'text-neutral-900' : 'text-neutral-400'
                }`}
                strokeWidth={isActive ? 2.25 : 1.75}
                fill={isActive && id === 'favorites' ? 'currentColor' : 'none'}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-neutral-900' : 'text-neutral-400'
                }`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
