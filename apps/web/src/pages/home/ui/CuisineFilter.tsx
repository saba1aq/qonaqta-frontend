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
  const base =
    'font-stamp uppercase tracking-[0.05em] text-[13.5px] px-4 py-2 border-2 border-ink whitespace-nowrap transition-all hover:-translate-x-px hover:-translate-y-px'
  const active = 'bg-lilac text-ink'
  const idle = 'bg-paper-3 text-ink hover:shadow-[3px_3px_0_#eec0ff]'

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => onSelect(null)}
        className={`${base} ${selectedId === null ? active : idle}`}
      >
        Все столы
      </button>
      {cuisines?.map((cuisine) => (
        <button
          key={cuisine.id}
          onClick={() => onSelect(cuisine.id === selectedId ? null : cuisine.id)}
          className={`${base} ${cuisine.id === selectedId ? active : idle}`}
        >
          {cuisine.name}
        </button>
      ))}
    </div>
  )
}
