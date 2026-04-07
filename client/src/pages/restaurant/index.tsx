import { useState, useRef, useCallback } from 'react'
import { useParams, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Share2, Clock, MapPin, Phone } from 'lucide-react'
import { useBranchDetail } from '@/entities/restaurant'
import type { BranchPhoto } from '@/entities/restaurant'
import { Button } from '@/shared/ui/button'

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export function RestaurantPage() {
  const { slug } = useParams({ strict: false }) as { slug: string }
  const navigate = useNavigate()
  const { data: branch, isLoading } = useBranchDetail(slug)
  const [photoIdx, setPhotoIdx] = useState(0)
  const [scheduleExpanded, setScheduleExpanded] = useState(false)
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

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-[280px] bg-muted" />
        <div className="p-4 space-y-3">
          <div className="h-6 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-full" />
        </div>
      </div>
    )
  }

  if (!branch) {
    return (
      <div className="p-4 text-center text-muted-foreground pt-20">
        Ресторан не найден
      </div>
    )
  }

  const todaySchedule = branch.schedules.find(
    (s) => s.day_of_week === new Date().getDay() || (new Date().getDay() === 0 && s.day_of_week === 7),
  )

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: branch.name,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-shrink-0 relative h-[240px] overflow-hidden">
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
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Link
            to="/"
            className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h1 className="text-2xl font-bold">{branch.name}</h1>
          <div className="flex items-center gap-1 mt-1 text-sm opacity-90">
            <MapPin className="w-3.5 h-3.5" />
            <span>{branch.address}</span>
          </div>
        </div>

        {allPhotos.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-1">
            {allPhotos.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === photoIdx ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-40">
        <div className="space-y-5">
            {branch.cuisines.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {branch.cuisines.map((c) => (
                  <span
                    key={c.id}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            )}

            {branch.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {branch.description}
              </p>
            )}

            <div className="space-y-3">
              {todaySchedule && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  {todaySchedule.is_closed ? (
                    <span className="text-destructive">Сегодня закрыто</span>
                  ) : (
                    <span>
                      Сегодня: {todaySchedule.open_time.slice(0, 5)} — {todaySchedule.close_time.slice(0, 5)}
                    </span>
                  )}
                </div>
              )}

              {branch.phone && (
                <a href={`tel:${branch.phone}`} className="flex items-center gap-2.5 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{branch.phone}</span>
                </a>
              )}

              {branch.instagram && (
                <a
                  href={`https://instagram.com/${branch.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm"
                >
                  <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  <span>@{branch.instagram}</span>
                </a>
              )}
            </div>

            {branch.schedules.length > 0 && (() => {
              const todayDow = new Date().getDay() === 0 ? 7 : new Date().getDay()
              const sorted = [...branch.schedules].sort((a, b) => a.day_of_week - b.day_of_week)
              const todayEntry = sorted.find((s) => s.day_of_week === todayDow)
              const visible = scheduleExpanded ? sorted : (todayEntry ? [todayEntry] : sorted)
              return (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">Расписание</h3>
                    <button
                      onClick={() => setScheduleExpanded((v) => !v)}
                      className="text-xs text-muted-foreground flex items-center gap-1"
                    >
                      {scheduleExpanded ? 'Свернуть' : 'Все дни'}
                      <span className={`transition-transform duration-200 ${scheduleExpanded ? 'rotate-180' : ''}`}>▾</span>
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {visible.map((s) => {
                      const isToday = s.day_of_week === todayDow
                      return (
                        <div
                          key={s.day_of_week}
                          className={`flex justify-between text-sm ${isToday ? 'font-medium' : ''}`}
                        >
                          <span className={isToday ? 'text-foreground' : 'text-muted-foreground'}>
                            {DAY_NAMES[s.day_of_week - 1]}
                          </span>
                          {s.is_closed ? (
                            <span className="text-muted-foreground">Закрыто</span>
                          ) : (
                            <span>
                              {s.open_time.slice(0, 5)} — {s.close_time.slice(0, 5)}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}

            {branch.photos.length > 1 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Фото</h3>
                <div className="flex gap-2 overflow-x-auto -mx-4 px-4 scrollbar-none">
                  {branch.photos.map((photo) => (
                    <img
                      key={photo.id}
                      src={photo.image_url}
                      alt=""
                      className="w-[120px] h-[90px] rounded-lg object-cover flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {branch.booking_enabled && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto p-4 bg-white border-t">
          <Button
            className="w-full h-12 rounded-xl text-sm font-semibold"
            onClick={() => navigate({ to: '/restaurant/$slug/book', params: { slug } })}
          >
            Забронировать столик
          </Button>
        </div>
      )}
    </div>
  )
}
