import { Search } from 'lucide-react'

export function SearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-[18px] h-[18px]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Найти ресторан..."
        className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  )
}
