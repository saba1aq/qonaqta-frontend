import { useEffect, useRef } from 'react'
import { MapPin, ChevronDown, Check } from 'lucide-react'
import type { City } from '@/entities/restaurant'

export function CityPicker({
  cities,
  selectedCityId,
  onCitySelect,
  showPicker,
  onTogglePicker,
  selectedCityName,
}: {
  cities: City[] | undefined
  selectedCityId: number | undefined
  onCitySelect: (cityId: number) => void
  showPicker: boolean
  onTogglePicker: () => void
  selectedCityName: string | undefined
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showPicker) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onTogglePicker()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onTogglePicker()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [showPicker, onTogglePicker])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={onTogglePicker}
        aria-expanded={showPicker}
        aria-haspopup="listbox"
        className="inline-flex items-center gap-2 font-stamp uppercase tracking-[0.08em] text-[13px] border-2 border-ink bg-paper-3 px-3.5 py-2.5 hover:bg-lilac-soft transition-colors"
      >
        <MapPin className="size-4" />
        <span>{selectedCityName ?? 'Выберите город'}</span>
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${showPicker ? 'rotate-180' : ''}`}
        />
      </button>

      {showPicker && cities && cities.length > 0 && (
        <div
          role="listbox"
          className="dropdown-pop absolute right-0 mt-2 z-40 min-w-55 max-h-80 overflow-y-auto bg-paper-3 border-2 border-ink shadow-[0_16px_34px_-16px_rgba(28,28,28,0.16)]"
        >
          {cities.map((city) => {
            const active = city.id === selectedCityId
            return (
              <button
                key={city.id}
                role="option"
                aria-selected={active}
                onClick={() => onCitySelect(city.id)}
                className={`w-full flex items-center justify-between gap-4 px-4 py-3 text-left font-stamp uppercase tracking-[0.06em] text-[13px] border-b border-ink/12 last:border-b-0 transition-colors ${
                  active ? 'bg-lilac text-ink font-semibold' : 'text-ink hover:bg-lilac-soft'
                }`}
              >
                <span>{city.name}</span>
                {active && <Check className="size-4 shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
