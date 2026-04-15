import { MapPin } from 'lucide-react'
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
    <>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onTogglePicker}
          className="flex items-center gap-1.5 text-sm text-muted-foreground"
        >
          <MapPin className="w-4 h-4" />
          <span>{selectedCityName ?? 'Выберите город'}</span>
        </button>
      </div>

      {showPicker && cities && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => onCitySelect(city.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                city.id === selectedCityId
                  ? 'bg-foreground text-white border-foreground'
                  : 'bg-white text-foreground border-border'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
