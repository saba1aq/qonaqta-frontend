import { Link } from '@tanstack/react-router'
import type { BranchList } from '@/entities/restaurant'

export function BranchCard({ branch }: { branch: BranchList; index?: number }) {
  const photo = branch.photos[0]?.image_url

  return (
    <Link
      to="/restaurant/$id"
      params={{ id: String(branch.id) }}
      className="block bg-paper-3 border-2 border-ink"
    >
      <div className="relative aspect-[5/4] overflow-hidden border-b-2 border-ink bg-paper-2">
        {photo ? (
          <img
            src={photo}
            alt={branch.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-paper-2" />
        )}
      </div>
      {/* спот-краска как печатная лента, не тонирует фото */}
      <div className="h-1.5 bg-lilac" />
      <div className="p-4">
        {branch.cuisines[0] && (
          <div className="font-stamp uppercase tracking-[0.1em] text-[11px] font-semibold text-ink-soft">
            {branch.cuisines.map((c) => c.name).slice(0, 2).join(' · ')}
          </div>
        )}
        <h3 className="font-display font-bold tracking-[-0.03em] text-[22px] mt-1.5">
          {branch.name}
        </h3>
        <div className="text-[13.5px] text-ink-soft mt-1">{branch.address}</div>
      </div>
    </Link>
  )
}
