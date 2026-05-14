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
  const activeCls =
    'h-9 px-5 rounded-full bg-neutral-200 text-neutral-900 text-sm whitespace-nowrap inline-flex items-center justify-center'
  const inactiveCls =
    'h-9 px-5 rounded-full bg-white border border-neutral-200 text-neutral-400 text-[10px] font-bold tracking-[1px] uppercase whitespace-nowrap inline-flex items-center justify-center transition-colors hover:text-neutral-600'

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelect(null)}
        className={selectedId === null ? activeCls : inactiveCls}
      >
        {selectedId === null ? 'Все' : 'Все'}
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
