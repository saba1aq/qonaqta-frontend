import type { Feature } from '@/entities/restaurant'

export function FeaturesSection({ features }: { features: Feature[] }) {
  if (features.length === 0) return null

  const half = Math.ceil(features.length / 2)
  const row1 = features.slice(0, half)
  const row2 = features.slice(half)

  return (
    <div>
      <h3 className="text-[15px] font-semibold text-neutral-900 mb-3">Особенности</h3>
      <div
        className="-mx-5 px-5 overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="flex flex-col items-start gap-2 w-max">
          <div className="flex gap-2">
            {row1.map((f) => (
              <Chip key={f.id} feature={f} />
            ))}
          </div>
          {row2.length > 0 && (
            <div className="flex gap-2">
              {row2.map((f) => (
                <Chip key={f.id} feature={f} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Chip({ feature }: { feature: Feature }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-neutral-100 text-[13px] text-neutral-800 font-medium whitespace-nowrap">
      {feature.icon && <span className="text-[15px] leading-none">{feature.icon}</span>}
      {feature.name}
    </span>
  )
}
