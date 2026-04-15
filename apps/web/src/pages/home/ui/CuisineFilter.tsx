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
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
          selectedId === null
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
            onSelect(cuisine.id === selectedId ? null : cuisine.id)
          }
          className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
            cuisine.id === selectedId
              ? 'bg-foreground text-white border-foreground'
              : 'bg-white text-foreground border-border hover:bg-secondary'
          }`}
        >
          {cuisine.name}
        </button>
      ))}
    </div>
  )
}
