import { Search } from 'lucide-react'

export function SearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-2 border-ink bg-paper-3">
      <Search className="size-5 text-ink shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Найти ресторан или кухню…"
        className="flex-1 min-w-0 bg-transparent text-[15px] text-ink placeholder:text-ink-soft outline-none"
      />
    </div>
  )
}
