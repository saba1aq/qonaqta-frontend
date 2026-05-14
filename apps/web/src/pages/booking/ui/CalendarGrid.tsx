import type { BranchSchedule } from '@/entities/restaurant'
import { formatDate } from '../lib/time-slots'

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]
const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function startOfWeek(d: Date): Date {
  const result = new Date(d)
  result.setHours(0, 0, 0, 0)
  const dow = (result.getDay() + 6) % 7
  result.setDate(result.getDate() - dow)
  return result
}

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
  today.setHours(0, 0, 0, 0)

  const gridStart = startOfWeek(today)
  const days: Date[] = []
  for (let i = 0; i < 14; i++) {
    const d = new Date(gridStart)
    d.setDate(gridStart.getDate() + i)
    days.push(d)
  }

  const headerLabel = `${MONTH_NAMES[gridStart.getMonth()]} ${gridStart.getFullYear()}`

  return (
    <div>
      <h3 className="text-sm font-semibold text-center mb-3">{headerLabel}</h3>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center text-[11px] text-muted-foreground font-medium py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateStr = formatDate(day)
          const isPast = day < today
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
