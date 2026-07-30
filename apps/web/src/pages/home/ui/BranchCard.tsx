import { Link } from '@tanstack/react-router'
import type { BranchList } from '@/entities/restaurant'

const SPOTS = ['bg-riso-pink', 'bg-riso-blue', 'bg-riso-sun']

export function BranchCard({ branch, index = 0 }: { branch: BranchList; index?: number }) {
  const spot = SPOTS[index % SPOTS.length]
  const rot = index % 2 === 0 ? '-rotate-[0.4deg]' : 'rotate-[0.4deg]'
  const photo = branch.photos[0]?.image_url

  return (
    <Link
      to="/restaurant/$id"
      params={{ id: String(branch.id) }}
      className={`group block bg-paper-3 border-2 border-ink shadow-[7px_7px_0_#211d17] ${rot} hover:rotate-0 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[11px_11px_0_#f2315d] transition-all duration-150`}
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
          <div className={`w-full h-full ${spot}`} />
        )}
      </div>
      {/* спот-краска как печатная лента, не тонирует фото */}
      <div className={`h-1.5 ${spot}`} />
      <div className="p-4">
        {branch.cuisines[0] && (
          <div className="font-stamp uppercase tracking-[0.1em] text-[11px] font-semibold text-riso-blue">
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
