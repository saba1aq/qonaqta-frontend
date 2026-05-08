import { Link } from '@tanstack/react-router'
import type { BranchList } from '@/entities/restaurant'

export function BranchCard({ branch }: { branch: BranchList }) {
  return (
    <Link
      to="/restaurant/$id"
      params={{ id: String(branch.id) }}
      className="relative rounded-2xl overflow-hidden h-[200px] bg-muted block"
    >
      {branch.photos.length > 0 ? (
        <img
          src={branch.photos[0].image_url}
          alt={branch.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/30" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-4 left-4 text-white">
        <p className="font-semibold text-lg">{branch.name}</p>
        <p className="text-xs opacity-80">{branch.address}</p>
        {branch.cuisines.length > 0 && (
          <div className="flex gap-1 mt-1">
            {branch.cuisines.slice(0, 3).map((c) => (
              <span
                key={c.id}
                className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded"
              >
                {c.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
