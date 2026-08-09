import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useCities, useBranches } from '@/entities/restaurant'
import type { BranchList } from '@/entities/restaurant'

function FeaturedCard({ branch }: { branch: BranchList }) {
  const photo = branch.photos[0]?.image_url
  return (
    <Link
      to="/restaurant/$id"
      params={{ id: String(branch.id) }}
      className="w-[248px] shrink-0 bg-paper-3 border-2 border-ink"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-ink bg-paper-2">
        {photo ? (
          <img src={photo} alt={branch.name} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-paper-2" />
        )}
      </div>
      <div className="h-1.5 bg-lilac" />
      <div className="p-4">
        {branch.cuisines[0] && (
          <div className="font-stamp uppercase tracking-[0.1em] text-[10.5px] font-semibold text-ink-soft">
            {branch.cuisines[0].name}
          </div>
        )}
        <h3 className="font-display font-bold tracking-[-0.03em] text-[19px] mt-1 truncate">
          {branch.name}
        </h3>
        <div className="text-[12.5px] text-ink-soft mt-0.5 truncate">{branch.address}</div>
      </div>
    </Link>
  )
}

export function FeaturedSection() {
  const { data: cities } = useCities()
  const cityId = cities?.[0]?.id
  const { data: branches, isLoading } = useBranches(cityId)
  const featured = (branches ?? []).slice(0, 8)

  if (!isLoading && featured.length === 0) return null

  return (
    <section className="pt-[clamp(30px,5vw,56px)]">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-6">
        <h2 className="font-display font-bold tracking-[-0.035em] text-[clamp(24px,4.5vw,40px)]">
          Куда сходить сегодня
        </h2>
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-1.5 font-stamp uppercase tracking-[0.1em] text-[12px] text-ink hover:text-ink-soft transition-colors"
        >
          Все рестораны <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="-mx-[clamp(18px,4vw,44px)] px-[clamp(18px,4vw,44px)] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-5 pb-2 min-w-max">
          {isLoading
            ? [0, 1, 2, 3].map((i) => (
                <div key={i} className="w-[248px] shrink-0 aspect-[4/3] border-2 border-ink bg-paper-2 animate-pulse" />
              ))
            : featured.map((branch) => <FeaturedCard key={branch.id} branch={branch} />)}
        </div>
      </div>
    </section>
  )
}
