import type { Cuisine } from '@/entities/restaurant'

export function CuisineFilter({
  cuisines,
  selectedId,
  onSelect,
}: {
  cuisines: Cuisine[] | undefined
  selectedId: number | null
  onSelect: (id: number | null) => void
}) {
  const baseCls =
    'h-9 px-5 rounded-full text-sm whitespace-nowrap inline-flex items-center justify-center transition-colors'
  const activeCls = `${baseCls} bg-neutral-200 text-neutral-900`
  const inactiveCls = `${baseCls} bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-900`

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelect(null)}
        className={selectedId === null ? activeCls : inactiveCls}
      >
        Все
      </button>
      {cuisines?.map((cuisine) => (
        <button
          key={cuisine.id}
          onClick={() => onSelect(cuisine.id === selectedId ? null : cuisine.id)}
          className={cuisine.id === selectedId ? activeCls : inactiveCls}
        >
          {cuisine.name}
        </button>
      ))}
    </div>
  )
}
