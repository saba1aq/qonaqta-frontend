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
  const active = 'bg-riso-pink text-paper-3 border-riso-pink'
  // спот-краски чередуются по чипам — «индекс кухонь» из печатного зина
  const spotHover = [
    'bg-paper-3 text-ink hover:shadow-[3px_3px_0_#f2315d]',
    'bg-paper-3 text-ink hover:shadow-[3px_3px_0_#2331b4]',
    'bg-paper-3 text-ink hover:shadow-[3px_3px_0_#f4b71a]',
  ]

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => onSelect(null)}
        className={`${base} ${selectedId === null ? active : 'bg-paper-3 text-ink hover:shadow-[3px_3px_0_#211d17]'}`}
      >
        Все столы
      </button>
      {cuisines?.map((cuisine, i) => (
        <button
          key={cuisine.id}
          onClick={() => onSelect(cuisine.id === selectedId ? null : cuisine.id)}
          className={`${base} ${cuisine.id === selectedId ? active : spotHover[i % spotHover.length]}`}
        >
          {cuisine.name}
        </button>
      ))}
    </div>
  )
}
