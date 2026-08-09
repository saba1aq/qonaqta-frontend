import { useState } from 'react'
import { useBranches, useCities, useCuisines } from '@/entities/restaurant'
import { useDebounce } from '@/shared/lib/use-debounce'
import { CityPicker } from './CityPicker'
import { SearchBar } from './SearchBar'
import { CuisineFilter } from './CuisineFilter'
import { BranchCard } from './BranchCard'
import { PromoRail } from './PromoRail'
import { Misreg } from '@/shared/ui/misreg'

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCuisineId, setSelectedCuisineId] = useState<number | null>(null)
  const debouncedQuery = useDebounce(searchQuery, 300)

  const [selectedCityId, setSelectedCityId] = useState<number | undefined>(() => {
    const stored = localStorage.getItem('selected_city_id')
    return stored ? Number(stored) : undefined
  })
  const [showCityPicker, setShowCityPicker] = useState(false)

  const { data: cities } = useCities()
  const { data: cuisines } = useCuisines()

  const activeCityId = selectedCityId ?? cities?.[0]?.id
  const { data: branches, isLoading } = useBranches(
    activeCityId,
    debouncedQuery || undefined,
    selectedCuisineId ? [selectedCuisineId] : undefined,
  )

  const selectedCity = cities?.find((c) => c.id === activeCityId)
  const isFiltering = Boolean(debouncedQuery) || selectedCuisineId !== null

  const handleCitySelect = (cityId: number) => {
    setSelectedCityId(cityId)
    localStorage.setItem('selected_city_id', String(cityId))
    setShowCityPicker(false)
  }

  return (
    <div className="mx-auto max-w-[1140px] px-[clamp(18px,4vw,44px)] py-[clamp(20px,3vw,36px)]">
      {/* header */}
      <div className="flex items-end justify-between gap-4 flex-wrap mb-5">
        <h1 className="font-display font-bold tracking-[-0.035em] text-[clamp(26px,5vw,44px)]">
          Столы{' '}
          <Misreg>{selectedCity?.name ?? 'города'}</Misreg>
        </h1>
        <CityPicker
          cities={cities}
          selectedCityId={activeCityId}
          onCitySelect={handleCitySelect}
          showPicker={showCityPicker}
          onTogglePicker={() => setShowCityPicker(!showCityPicker)}
          selectedCityName={selectedCity?.name}
        />
      </div>

      <div className="border-t-2 border-ink pt-5 space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CuisineFilter
          cuisines={cuisines}
          selectedId={selectedCuisineId}
          onSelect={setSelectedCuisineId}
        />
      </div>

      {!isFiltering && <PromoRail cityId={activeCityId} />}

      {/* grid */}
      <div className="mt-7">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="border-2 border-ink bg-paper-2 aspect-[5/4] animate-pulse" />
            ))}
          </div>
        ) : branches?.length === 0 ? (
          <div className="border-2 border-dashed border-ink py-16 text-center">
            <p className="font-display font-bold text-[22px]">Ничего не найдено</p>
            <p className="text-ink-soft text-[14px] mt-2">Попробуйте другой запрос или кухню.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-7">
            {branches?.map((branch, i) => (
              <BranchCard key={branch.id} branch={branch} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
