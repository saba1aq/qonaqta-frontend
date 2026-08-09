import { Minus, Plus } from 'lucide-react'

export function GuestCountSelector({
  count,
  onChange,
}: {
  count: number
  onChange: (count: number) => void
}) {
  return (
    <div>
      <h3 className="font-stamp uppercase tracking-[0.12em] text-[12px] text-ink-soft mb-3">
        Гости
      </h3>
      <div className="inline-flex border-2 border-ink">
        <button
          onClick={() => onChange(count - 1)}
          disabled={count <= 1}
          className="w-12 h-12 grid place-items-center bg-paper-3 hover:bg-lilac-soft disabled:opacity-30 disabled:hover:bg-paper-3 transition-colors"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-16 grid place-items-center font-display font-bold text-[20px] border-x-2 border-ink">
          {count}
        </span>
        <button
          onClick={() => onChange(count + 1)}
          disabled={count >= 20}
          className="w-12 h-12 grid place-items-center bg-paper-3 hover:bg-lilac-soft disabled:opacity-30 disabled:hover:bg-paper-3 transition-colors"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  )
}
