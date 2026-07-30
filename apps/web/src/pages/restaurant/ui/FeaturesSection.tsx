import type { Feature } from '@/entities/restaurant'

export function FeaturesSection({ features }: { features: Feature[] }) {
  if (features.length === 0) return null

  return (
    <div>
      <h3 className="font-stamp uppercase tracking-[0.12em] text-[12px] text-ink-soft mb-3">
        Особенности
      </h3>
      <div className="flex flex-wrap gap-2">
        {features.map((f) => (
          <span
            key={f.id}
            className="inline-flex items-center gap-2 px-3.5 py-2 border-2 border-ink bg-paper-3 text-[13.5px] font-medium whitespace-nowrap"
          >
            {f.icon && <span className="text-[15px] leading-none">{f.icon}</span>}
            {f.name}
          </span>
        ))}
      </div>
    </div>
  )
}
