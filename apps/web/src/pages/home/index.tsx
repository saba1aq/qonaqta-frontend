import { useState, useEffect, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { MapPin, Search } from 'lucide-react'
import { useBranches, useCities, useCuisines } from '@/entities/restaurant'

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

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
  const { data: branches, isLoading } = useBranches(
    selectedCityId,
    debouncedQuery || undefined,
    selectedCuisineId ? [selectedCuisineId] : undefined,
  )

  useEffect(() => {
    if (cities?.length && !selectedCityId) {
      setSelectedCityId(cities[0].id)
      localStorage.setItem('selected_city_id', String(cities[0].id))
    }
  }, [cities, selectedCityId])

  const selectedCity = cities?.find((c) => c.id === selectedCityId)

  const newBranches = useMemo(() => branches?.slice(0, 5) ?? [], [branches])

  const handleCitySelect = (cityId: number) => {
    setSelectedCityId(cityId)
    localStorage.setItem('selected_city_id', String(cityId))
  }

  const [showCityPicker, setShowCityPicker] = useState(false)

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-shrink-0 px-4 pt-4 pb-2 bg-white">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowCityPicker(!showCityPicker)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <MapPin className="w-4 h-4" />
            <span>{selectedCity?.name ?? 'Выберите город'}</span>
          </button>
        </div>

        {showCityPicker && cities && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => {
                  handleCitySelect(city.id)
                  setShowCityPicker(false)
                }}
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

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-[18px] h-[18px]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Найти ресторан..."
            className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
          {/* TODO: фильтр — добавить в будущем
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <SlidersHorizontal className="w-[18px] h-[18px]" />
          </button>
          */}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCuisineId(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
              selectedCuisineId === null
                ? 'bg-foreground text-white border-foreground'
                : 'bg-white text-foreground border-border hover:bg-secondary'
            }`}
          >
            Все
          </button>
          {cuisines?.map((cuisine) => (
            <button
              key={cuisine.id}
              onClick={() =>
                setSelectedCuisineId(cuisine.id === selectedCuisineId ? null : cuisine.id)
              }
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
                cuisine.id === selectedCuisineId
                  ? 'bg-foreground text-white border-foreground'
                  : 'bg-white text-foreground border-border hover:bg-secondary'
              }`}
            >
              {cuisine.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-8">
        {newBranches.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mb-3">Новые на платформе</h2>
            <div className="flex gap-3 overflow-x-auto pb-4 mb-4 -mx-4 px-4 scrollbar-none">
              {newBranches.map((branch) => (
                <Link
                  key={branch.id}
                  to="/restaurant/$slug"
                  params={{ slug: branch.slug }}
                  className="flex-shrink-0 w-[160px]"
                >
                  <div className="relative rounded-xl overflow-hidden h-[120px] bg-muted mb-2">
                    {branch.cover_image_url ? (
                      <img
                        src={branch.cover_image_url}
                        alt={branch.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20" />
                    )}
                    <span className="absolute top-2 left-2 bg-foreground text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      NEW
                    </span>
                  </div>
                  <p className="text-sm font-medium truncate">{branch.name}</p>
                </Link>
              ))}
            </div>
          </>
        )}

        <h2 className="text-lg font-semibold mb-3">Все заведения</h2>

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
              <Link
                key={branch.id}
                to="/restaurant/$slug"
                params={{ slug: branch.slug }}
                className="relative rounded-2xl overflow-hidden h-[200px] bg-muted block"
              >
                {branch.cover_image_url ? (
                  <img
                    src={branch.cover_image_url}
                    alt={branch.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/30" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold text-lg">{branch.name}</p>
                  <p className="text-xs opacity-80">{branch.address}</p>
                  {branch.cuisines.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {branch.cuisines.slice(0, 3).map((c) => (
                        <span
                          key={c.id}
                          className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
