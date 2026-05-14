import { useState } from 'react'
import { useBranches, useCities, useCuisines } from '@/entities/restaurant'
import { useDebounce } from '@/shared/lib/use-debounce'
import { CityPicker } from './CityPicker'
import { SearchBar } from './SearchBar'
import { CuisineFilter } from './CuisineFilter'
import { BranchCard } from './BranchCard'

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCuisineId, setSelectedCuisineId] = useState<number | null>(null)
  const debouncedQuery = useDebounce(searchQuery, 300)

  const [selectedCityId, setSelectedCityId] = useState<number | undefined>(() => {
    const stored = localStorage.getItem('selected_city_id')
    return stored ? Number(stored) : undefined
  })

  const { data: cities } = useCities()
  const { data: cuisines } = useCuisines()

  const activeCityId = selectedCityId ?? cities?.[0]?.id
  const { data: branches, isLoading } = useBranches(
    activeCityId,
    debouncedQuery || undefined,
    selectedCuisineId ? [selectedCuisineId] : undefined,
  )

  const selectedCity = cities?.find((c) => c.id === activeCityId)

  const handleCitySelect = (cityId: number) => {
    setSelectedCityId(cityId)
    localStorage.setItem('selected_city_id', String(cityId))
    setShowCityPicker(false)
  }

  const [showCityPicker, setShowCityPicker] = useState(false)

  return (
    <div className="flex flex-col h-svh">
      <div className="flex-shrink-0 px-4 pt-4 pb-2 bg-white">
        <CityPicker
          cities={cities}
          selectedCityId={selectedCityId}
          onCitySelect={handleCitySelect}
          showPicker={showCityPicker}
          onTogglePicker={() => setShowCityPicker(!showCityPicker)}
          selectedCityName={selectedCity?.name}
        />

        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <CuisineFilter
          cuisines={cuisines}
          selectedId={selectedCuisineId}
          onSelect={setSelectedCuisineId}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-8">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl h-[200px] bg-muted animate-pulse" />
            ))}
          </div>
        ) : branches?.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Ничего не найдено</p>
        ) : (
          <div className="flex flex-col gap-4">
            {branches?.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
