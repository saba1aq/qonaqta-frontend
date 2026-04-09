import { useState, useRef, useCallback } from 'react'
import { useParams, Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Share2,
  MapPin,
  Phone,
  ChevronDown,
  Navigation,
  ExternalLink,
} from 'lucide-react'
import { useBranchDetail } from '@/entities/restaurant'
import type { BranchPhoto } from '@/entities/restaurant'
import { Button } from '@qonaqta/ui/components/button'

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export function RestaurantPage() {
  const { slug } = useParams({ strict: false }) as { slug: string }
  const navigate = useNavigate()
  const { data: branch, isLoading } = useBranchDetail(slug)
  const [photoIdx, setPhotoIdx] = useState(0)
  const [scheduleExpanded, setScheduleExpanded] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)
  const touchStartX = useRef(0)

  const allPhotos: BranchPhoto[] = branch
    ? branch.photos.length > 0
      ? branch.photos
      : branch.cover_image_url
        ? [{ id: 0, image_url: branch.cover_image_url, sort_order: 0 }]
        : []
    : []

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      setPhotoIdx((prev) => {
        if (diff > 0) return Math.min(prev + 1, allPhotos.length - 1)
        return Math.max(prev - 1, 0)
      })
    }
  }, [allPhotos.length])

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

  const todayDow = new Date().getDay() === 0 ? 7 : new Date().getDay()
  const todaySchedule = branch.schedules.find((s) => s.day_of_week === todayDow)
  const sorted = [...branch.schedules].sort((a, b) => a.day_of_week - b.day_of_week)

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="relative h-[320px] flex-shrink-0 overflow-hidden">
        {allPhotos.length > 0 ? (
          <div
            className="flex h-full transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${photoIdx * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {allPhotos.map((photo) => (
              <img
                key={photo.id}
                src={photo.image_url}
                alt={branch.name}
                className="w-full h-full object-cover flex-shrink-0"
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
        )}

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

        {allPhotos.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {allPhotos.map((_, i) => (
              <button
                key={i}
                onClick={() => setPhotoIdx(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === photoIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

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

          <div className="flex gap-3">
            {branch.phone && (
              <a
                href={`tel:${branch.phone}`}
                className="flex-1 flex flex-col items-center gap-1.5 py-3.5 rounded-2xl bg-neutral-50 active:bg-neutral-100 transition-colors"
              >
                <Phone className="size-5 text-neutral-600" />
                <span className="text-[11px] text-neutral-500 font-medium">Позвонить</span>
              </a>
            )}
            <a
              href={`https://2gis.kz/search/${encodeURIComponent(branch.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex flex-col items-center gap-1.5 py-3.5 rounded-2xl bg-neutral-50 active:bg-neutral-100 transition-colors"
            >
              <Navigation className="size-5 text-neutral-600" />
              <span className="text-[11px] text-neutral-500 font-medium">Маршрут</span>
            </a>
            {branch.instagram && (
              <a
                href={`https://instagram.com/${branch.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex flex-col items-center gap-1.5 py-3.5 rounded-2xl bg-neutral-50 active:bg-neutral-100 transition-colors"
              >
                <InstagramIcon className="size-5 text-neutral-600" />
                <span className="text-[11px] text-neutral-500 font-medium">Instagram</span>
              </a>
            )}
            {branch.tiktok && (
              <a
                href={`https://tiktok.com/@${branch.tiktok.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex flex-col items-center gap-1.5 py-3.5 rounded-2xl bg-neutral-50 active:bg-neutral-100 transition-colors"
              >
                <ExternalLink className="size-5 text-neutral-600" />
                <span className="text-[11px] text-neutral-500 font-medium">TikTok</span>
              </a>
            )}
          </div>

          {branch.description && (
            <div>
              <h3 className="text-[15px] font-semibold text-neutral-900 mb-2">О заведении</h3>
              <p className={`text-sm text-neutral-500 leading-relaxed ${!descExpanded ? 'line-clamp-3' : ''}`}>
                {branch.description}
              </p>
              {branch.description.length > 150 && (
                <button
                  onClick={() => setDescExpanded(!descExpanded)}
                  className="text-xs font-medium text-neutral-900 mt-1.5 underline underline-offset-2"
                >
                  {descExpanded ? 'Свернуть' : 'Подробнее'}
                </button>
              )}
            </div>
          )}

          {sorted.length > 0 && (
            <div>
              <button
                onClick={() => setScheduleExpanded(!scheduleExpanded)}
                className="w-full flex items-center justify-between mb-3"
              >
                <h3 className="text-[15px] font-semibold text-neutral-900">Режим работы</h3>
                <div className="flex items-center gap-1 text-xs text-neutral-400">
                  {!scheduleExpanded && todaySchedule && !todaySchedule.is_closed && (
                    <span>
                      {todaySchedule.open_time.slice(0, 5)} — {todaySchedule.close_time.slice(0, 5)}
                    </span>
                  )}
                  <ChevronDown className={`size-4 transition-transform duration-200 ${scheduleExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {scheduleExpanded && (
                <div className="rounded-2xl bg-neutral-50 p-4 space-y-2.5">
                  {sorted.map((s) => {
                    const isToday = s.day_of_week === todayDow
                    return (
                      <div
                        key={s.day_of_week}
                        className={`flex justify-between items-center text-sm ${
                          isToday ? 'font-semibold text-neutral-900' : 'text-neutral-500'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isToday && <span className="size-1.5 rounded-full bg-emerald-500" />}
                          {DAY_NAMES[s.day_of_week - 1]}
                        </span>
                        {s.is_closed ? (
                          <span className="text-neutral-300">Закрыто</span>
                        ) : (
                          <span>
                            {s.open_time.slice(0, 5)} — {s.close_time.slice(0, 5)}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

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
