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
      <h3 className="text-sm font-semibold mb-3">Количество гостей</h3>
      <div className="flex items-center gap-5">
        <button
          onClick={() => onChange(count - 1)}
          disabled={count <= 1}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center disabled:opacity-30"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-2xl font-semibold w-8 text-center">{count}</span>
        <button
          onClick={() => onChange(count + 1)}
          disabled={count >= 20}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center disabled:opacity-30"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
