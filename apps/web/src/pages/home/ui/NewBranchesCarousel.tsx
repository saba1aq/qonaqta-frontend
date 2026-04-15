import { Link } from '@tanstack/react-router'
import type { BranchList } from '@/entities/restaurant'

export function NewBranchesCarousel({ branches }: { branches: BranchList[] }) {
  if (branches.length === 0) return null

  return (
    <>
      <h2 className="text-lg font-semibold mb-3">Новые на платформе</h2>
      <div className="flex gap-3 overflow-x-auto pb-4 mb-4 -mx-4 px-4 scrollbar-none">
        {branches.map((branch) => (
          <Link
            key={branch.id}
            to="/restaurant/$slug"
            params={{ slug: branch.slug }}
            className="flex-shrink-0 w-[160px]"
          >
            <div className="relative rounded-xl overflow-hidden h-[120px] bg-muted mb-2">
              {branch.cover_image_url ? (
                <img
                  src={branch.cover_image_url}
                  alt={branch.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20" />
              )}
              <span className="absolute top-2 left-2 bg-foreground text-white text-[10px] font-bold px-2 py-0.5 rounded">
                NEW
              </span>
            </div>
            <p className="text-sm font-medium truncate">{branch.name}</p>
          </Link>
        ))}
      </div>
    </>
  )
}
