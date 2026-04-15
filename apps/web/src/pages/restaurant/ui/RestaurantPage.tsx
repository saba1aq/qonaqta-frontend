import { useParams, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Share2, MapPin } from 'lucide-react'
import { useBranchDetail } from '@/entities/restaurant'
import type { BranchPhoto } from '@/entities/restaurant'
import { Button } from '@qonaqta/ui/components/button'
import { PhotoCarousel } from './PhotoCarousel'
import { ActionButtons } from './ActionButtons'
import { DescriptionSection } from './DescriptionSection'
import { ScheduleSection } from './ScheduleSection'

export function RestaurantPage() {
  const { slug } = useParams({ strict: false }) as { slug: string }
  const navigate = useNavigate()
  const { data: branch, isLoading } = useBranchDetail(slug)

  const allPhotos: BranchPhoto[] = branch
    ? branch.photos.length > 0
      ? branch.photos
      : branch.cover_image_url
        ? [{ id: 0, image_url: branch.cover_image_url, sort_order: 0 }]
        : []
    : []

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: branch?.name, url: window.location.href })
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-[320px] bg-neutral-100" />
        <div className="p-5 space-y-4">
          <div className="h-7 bg-neutral-100 rounded-lg w-3/4" />
          <div className="h-4 bg-neutral-100 rounded-lg w-1/2" />
          <div className="flex gap-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="size-14 rounded-2xl bg-neutral-100" />
            ))}
          </div>
          <div className="h-20 bg-neutral-100 rounded-xl mt-4" />
        </div>
      </div>
    )
  }

  if (!branch) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-neutral-400">
        <p className="text-lg font-medium">Ресторан не найден</p>
        <Link to="/" className="mt-3 text-sm text-neutral-900 underline underline-offset-4">
          На главную
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="relative h-[320px] flex-shrink-0 overflow-hidden">
        <PhotoCarousel photos={allPhotos} branchName={branch.name} />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 pointer-events-none" />

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
          <Link
            to="/"
            className="size-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            <ArrowLeft className="size-5 text-neutral-900" />
          </Link>
          <button
            onClick={handleShare}
            className="size-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            <Share2 className="size-5 text-neutral-900" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <h1 className="text-[26px] font-bold text-white leading-tight tracking-tight">
            {branch.name}
          </h1>
          <div className="flex items-center gap-1.5 mt-1.5 text-white/80 text-sm">
            <MapPin className="size-3.5 flex-shrink-0" />
            <span className="truncate">{branch.address}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 -mt-3 relative z-20 bg-white rounded-t-3xl">
        <div className="w-10 h-1 rounded-full bg-neutral-200 mx-auto mt-3 mb-4" />

        <div className="px-5 pb-36 space-y-6">
          {branch.cuisines.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {branch.cuisines.map((c) => (
                <span
                  key={c.id}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700"
                >
                  {c.name}
                </span>
              ))}
            </div>
          )}

          <ActionButtons branch={branch} />

          {branch.description && (
            <DescriptionSection description={branch.description} />
          )}

          <ScheduleSection schedules={branch.schedules} />
        </div>
      </div>

      {branch.booking_enabled && (
        <div className="fixed bottom-0 left-0 right-0 max-w-120 mx-auto z-30">
          <div className="bg-white/80 backdrop-blur-xl border-t border-neutral-100 px-5 py-4">
            <Button
              className="w-full h-13 rounded-2xl text-[15px] font-semibold bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98] transition-all shadow-lg shadow-neutral-900/20"
              onClick={() => navigate({ to: '/restaurant/$slug/book', params: { slug } })}
            >
              Забронировать столик
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
