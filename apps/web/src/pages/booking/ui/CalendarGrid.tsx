import type { BranchSchedule } from '@/entities/restaurant'
import { formatDate } from '../lib/time-slots'

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]
const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export function CalendarGrid({
  date,
  onSelect,
  schedules,
}: {
  date: string | null
  onSelect: (date: string) => void
  schedules: BranchSchedule[] | undefined
}) {
  const today = new Date()
  const currentMonth = date ? new Date(date) : today
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const calendarDays = (() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startOffset = (firstDay.getDay() + 6) % 7

    const days: (Date | null)[] = []
    for (let i = 0; i < startOffset; i++) days.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d))
    return days
  })()

  const navigateMonth = (delta: number) => {
    const newDate = new Date(year, month + delta, 1)
    onSelect(formatDate(newDate))
  }

  return (
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
          const schedule = schedules?.find((s) => s.day_of_week === dayOfWeek)
          const isClosed = schedule?.is_closed ?? false

          return (
            <button
              key={dateStr}
              disabled={isPast || isClosed}
              onClick={() => onSelect(dateStr)}
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
  )
}
