import { MapPin, ChevronDown } from 'lucide-react'
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
  return (
    <div className="relative">
      <button
        onClick={onTogglePicker}
        className="inline-flex items-center gap-2 font-stamp uppercase tracking-[0.08em] text-[13px] border-2 border-ink bg-paper-3 px-3.5 py-2 hover:bg-riso-sun transition-colors"
      >
        <MapPin className="size-4" />
        <span>{selectedCityName ?? 'Выберите город'}</span>
        <ChevronDown className={`size-4 transition-transform ${showPicker ? 'rotate-180' : ''}`} />
      </button>

      {showPicker && cities && (
        <div className="flex gap-2 flex-wrap mt-3">
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => onCitySelect(city.id)}
              className={`font-stamp uppercase tracking-[0.05em] text-[12.5px] px-3.5 py-2 border-2 border-ink transition-colors ${
                city.id === selectedCityId
                  ? 'bg-ink text-paper-3'
                  : 'bg-paper-3 text-ink hover:bg-riso-sun'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
