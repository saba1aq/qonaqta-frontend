type Fact = { label: string; value: string }

export function QuickFactsStrip({ facts }: { facts: Fact[] }) {
  if (facts.length === 0) return null

  return (
    <div className="grid grid-cols-3 rounded-2xl border border-neutral-100 bg-neutral-50/60 overflow-hidden divide-x divide-neutral-100">
      {facts.map((f) => (
        <div key={f.label} className="px-2 py-3 text-center">
          <p className="text-[10.5px] uppercase tracking-wider text-neutral-400 font-semibold">
            {f.label}
          </p>
          <p className="text-[13px] font-semibold text-neutral-900 mt-1">{f.value}</p>
        </div>
      ))}
    </div>
  )
}
