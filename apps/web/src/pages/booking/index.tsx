import { useMemo } from 'react'
import { useParams, useNavigate, Link } from '@tanstack/react-router'
import { ArrowLeft, Minus, Plus } from 'lucide-react'
import { useBranchDetail } from '@/entities/restaurant'
import { useBookingFormStore } from '@/features/book-table'
import { Button } from '@qonaqta/ui/components/button'

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]
const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function formatDate(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function generateTimeSlots(openTime: string, closeTime: string): string[] {
  const slots: string[] = []
  const [openH, openM] = openTime.split(':').map(Number)
  const [closeH, closeM] = closeTime.split(':').map(Number)

  let current = openH * 60 + openM
  const end = closeH * 60 + closeM
  const adjustedEnd = end <= current ? end + 24 * 60 : end

  while (current < adjustedEnd - 30) {
    const h = Math.floor(current / 60) % 24
    const m = current % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    current += 30
  }
  return slots
}

export function BookingPage() {
  const { slug } = useParams({ strict: false }) as { slug: string }
  const navigate = useNavigate()
  const { data: branch } = useBranchDetail(slug)

  const { guestCount, date, timeSlot, setGuestCount, setDate, setTimeSlot } =
    useBookingFormStore()

  const today = new Date()
  const currentMonth = date ? new Date(date) : today
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startOffset = (firstDay.getDay() + 6) % 7

    const days: (Date | null)[] = []
    for (let i = 0; i < startOffset; i++) days.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d))
    return days
  }, [year, month])

  const selectedDayOfWeek = date ? (() => {
    const d = new Date(date)
    return d.getDay() === 0 ? 7 : d.getDay()
  })() : null

  const todaySchedule = selectedDayOfWeek !== null
    ? branch?.schedules.find((s) => s.day_of_week === selectedDayOfWeek)
    : null

  const timeSlots = useMemo(() => {
    if (!todaySchedule || todaySchedule.is_closed) return []
    return generateTimeSlots(todaySchedule.open_time, todaySchedule.close_time)
  }, [todaySchedule])

  const canProceed = date && timeSlot

  const navigateMonth = (delta: number) => {
    const newDate = new Date(year, month + delta, 1)
    setDate(formatDate(newDate))
  }

  return (
    <div className="pb-24">
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        <Link
          to="/restaurant/$slug"
          params={{ slug }}
          className="w-9 h-9 rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-base font-semibold">Детали бронирования</h1>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-3">Количество гостей</h3>
          <div className="flex items-center gap-5">
            <button
              onClick={() => setGuestCount(guestCount - 1)}
              disabled={guestCount <= 1}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center disabled:opacity-30"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-2xl font-semibold w-8 text-center">{guestCount}</span>
            <button
              onClick={() => setGuestCount(guestCount + 1)}
              disabled={guestCount >= 20}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center disabled:opacity-30"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => navigateMonth(-1)} className="text-sm text-muted-foreground">
              ←
            </button>
            <h3 className="text-sm font-semibold">
              {MONTH_NAMES[month]} {year}
            </h3>
            <button onClick={() => navigateMonth(1)} className="text-sm text-muted-foreground">
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEK_DAYS.map((d) => (
              <div key={d} className="text-center text-[11px] text-muted-foreground font-medium py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />
              const dateStr = formatDate(day)
              const isPast = day < new Date(today.getFullYear(), today.getMonth(), today.getDate())
              const isSelected = dateStr === date
              const dayOfWeek = day.getDay() === 0 ? 7 : day.getDay()
              const schedule = branch?.schedules.find((s) => s.day_of_week === dayOfWeek)
              const isClosed = schedule?.is_closed ?? false

              return (
                <button
                  key={dateStr}
                  disabled={isPast || isClosed}
                  onClick={() => setDate(dateStr)}
                  className={`h-10 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-foreground text-white'
                      : isPast || isClosed
                        ? 'text-muted-foreground/40'
                        : 'hover:bg-secondary'
                  }`}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>
        </div>

        {date && (
          <div>
            <h3 className="text-sm font-semibold mb-3">Время</h3>
            {timeSlots.length === 0 ? (
              <p className="text-sm text-muted-foreground">Нет доступного времени</p>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setTimeSlot(slot)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      slot === timeSlot
                        ? 'bg-foreground text-white border-foreground'
                        : 'bg-white text-foreground border-border hover:bg-secondary'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto p-4 bg-white border-t">
        <Button
          className="w-full h-12 rounded-xl text-sm font-semibold"
          disabled={!canProceed}
          onClick={() => navigate({ to: '/restaurant/$slug/book/confirm', params: { slug } })}
        >
          Продолжить
        </Button>
      </div>
    </div>
  )
}
