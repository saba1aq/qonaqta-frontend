import { useParams, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Share2, MapPin } from 'lucide-react'
import { useBranchDetail } from '@/entities/restaurant'
import type { BranchPhoto } from '@/entities/restaurant'
import { PhotoCarousel } from './PhotoCarousel'
import { DescriptionSection } from './DescriptionSection'
import { ScheduleSection } from './ScheduleSection'
import { StatusChip } from './StatusChip'
import { FeaturesSection } from './FeaturesSection'
import { Misreg } from '@/shared/ui/misreg'

export function RestaurantPage() {
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const { data: branch, isLoading } = useBranchDetail(id)

  const allPhotos: BranchPhoto[] = branch?.photos.length ? branch.photos : []

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: branch?.name, url: window.location.href })
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1140px] px-[clamp(18px,4vw,44px)] py-8 grid lg:grid-cols-2 gap-8 animate-pulse">
        <div className="aspect-[4/5] border-2 border-ink bg-paper-2" />
        <div className="space-y-4">
          <div className="h-10 w-3/4 bg-paper-2 border-2 border-ink" />
          <div className="h-4 w-1/2 bg-paper-2" />
          <div className="h-24 bg-paper-2 border-2 border-ink" />
        </div>
      </div>
    )
  }

  if (!branch) {
    return (
      <div className="mx-auto max-w-[1140px] px-6 py-24 text-center">
        <p className="font-display font-bold text-[26px]">Ресторан не найден</p>
        <Link
          to="/restaurants"
          className="inline-block mt-4 font-stamp uppercase text-[12px] tracking-[0.08em] underline underline-offset-4 decoration-lilac decoration-2"
        >
          К ресторанам
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1140px] px-[clamp(18px,4vw,44px)] pt-[clamp(22px,3vw,36px)] pb-36">
      {/* back / share */}
      <div className="flex items-center justify-between mb-5">
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-2 font-stamp uppercase tracking-[0.08em] text-[12px] hover:text-ink-soft transition-colors"
        >
          <ArrowLeft className="size-4" />
          К ресторанам
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 font-stamp uppercase tracking-[0.08em] text-[12px] border-2 border-ink px-3 py-1.5 bg-paper-3 hover:bg-lilac-soft transition-colors"
        >
          <Share2 className="size-3.5" />
          Поделиться
        </button>
      </div>

      {/* spread */}
      <div className="grid lg:grid-cols-2 gap-[clamp(22px,4vw,48px)] items-start">
        <div className="relative border-2 border-ink overflow-hidden aspect-[4/5] bg-lilac">
          <PhotoCarousel photos={allPhotos} branchName={branch.name} />
        </div>

        <div>
          {branch.status && (
            <div className="mb-3">
              <StatusChip status={branch.status} />
            </div>
          )}

          <h1 className="font-display font-extrabold tracking-[-0.04em] leading-[0.92] text-[clamp(32px,6vw,56px)]">
            <Misreg>{branch.name}</Misreg>
          </h1>
          <div className="flex items-center gap-1.5 mt-2.5 text-ink-soft text-[14px]">
            <MapPin className="size-4 shrink-0" />
            <span>{branch.address}</span>
          </div>

          {branch.cuisines.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {branch.cuisines.map((c) => (
                <span
                  key={c.id}
                  className="font-stamp uppercase tracking-[0.06em] text-[12px] border-2 border-ink px-3 py-1.5"
                >
                  {c.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-7 space-y-7">
            <FeaturesSection features={branch.features} />
            {branch.description && <DescriptionSection description={branch.description} />}
            <ScheduleSection schedules={branch.schedules} todayDow={branch.today_dow} />
          </div>
        </div>
      </div>

      {/* sticky booking CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-paper/90 backdrop-blur-md border-t-2 border-ink">
        <div className="mx-auto max-w-[1140px] px-[clamp(18px,4vw,44px)] py-3.5 flex items-center justify-between gap-4">
          <div className="hidden sm:block min-w-0">
            <div className="font-display font-bold text-[18px] truncate">{branch.name}</div>
            <div className="text-ink-soft text-[13px] truncate">
              {branch.cuisines[0]?.name}
              {branch.cuisines[0] ? ' · ' : ''}
              {branch.city.name}
            </div>
          </div>
          <button
            onClick={() => navigate({ to: '/restaurant/$id/book', params: { id } })}
            className="w-full sm:w-auto font-display font-bold text-[15px] bg-ink text-paper-3 px-7 py-4 shadow-[6px_6px_0_#eec0ff] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#eec0ff] active:translate-x-0 active:translate-y-0 transition-all"
          >
            Забронировать столик →
          </button>
        </div>
      </div>
    </div>
  )
}
