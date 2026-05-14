import { Search } from 'lucide-react'

export function SearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="mb-4 flex items-center gap-3 px-[17px] py-2.5 rounded-full border border-[#e0e0e0] bg-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
      <Search className="size-5 text-neutral-400 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Найти ресторан..."
        className="flex-1 min-w-0 bg-transparent text-base text-neutral-900 placeholder:text-neutral-400 outline-none"
      />
    </div>
  )
}
