import { CalendarDays } from 'lucide-react'
import type { BranchSchedule } from '@/entities/restaurant'
import { formatDate } from '../lib/time-slots'

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]
const WEEK_DAYS_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
const LEAD_TIME_MIN = 120
const SLOT_MIN = 30

function todayHasAvailableSlots(schedule: BranchSchedule | undefined): boolean {
  if (!schedule || schedule.is_closed) return false
  const now = new Date()
  const cutoffMin = now.getHours() * 60 + now.getMinutes() + LEAD_TIME_MIN
  const [oh, om] = schedule.open_time.split(':').map(Number)
  const [ch, cm] = schedule.close_time.split(':').map(Number)
  const openMin = oh * 60 + om
  let closeMin = ch * 60 + cm
  if (closeMin <= openMin) closeMin = 24 * 60
  const endExclusive = closeMin === 24 * 60 ? closeMin : closeMin - SLOT_MIN
  const firstSlot =
    cutoffMin <= openMin
      ? openMin
      : openMin + Math.ceil((cutoffMin - openMin) / SLOT_MIN) * SLOT_MIN
  return firstSlot < endExclusive
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
  const todayDow = today.getDay() === 0 ? 7 : today.getDay()
  const todaySchedule = schedules?.find((s) => s.day_of_week === todayDow)
  const skipToday = !todayHasAvailableSlots(todaySchedule)

  const start = new Date(today)
  if (skipToday) start.setDate(start.getDate() + 1)

  const days: Date[] = []
  for (let i = 0; i < 14; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push(d)
  }

  const lastDay = days[days.length - 1]
  const headerLabel =
    start.getMonth() === lastDay.getMonth()
      ? MONTH_NAMES[start.getMonth()]
      : `${MONTH_NAMES[start.getMonth()]} – ${MONTH_NAMES[lastDay.getMonth()]}`

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-stamp uppercase tracking-[0.12em] text-[12px] text-ink-soft">
          Дата · {headerLabel}
        </h3>
        <CalendarDays className="size-4 text-ink-soft" />
      </div>

      <div className="-mx-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2 min-w-max pb-1">
          {days.map((day) => {
            const dateStr = formatDate(day)
            const isSelected = dateStr === date
            const dayOfWeek = day.getDay() === 0 ? 7 : day.getDay()
            const schedule = schedules?.find((s) => s.day_of_week === dayOfWeek)
            const isClosed = schedule?.is_closed ?? false

            return (
              <button
                key={dateStr}
                disabled={isClosed}
                onClick={() => onSelect(dateStr)}
                className={`flex flex-col items-center justify-center w-14 h-[68px] shrink-0 border-2 border-ink transition-all ${
                  isSelected
                    ? 'bg-ink text-paper-3'
                    : isClosed
                      ? 'bg-paper-2 text-ink-soft/40 line-through cursor-not-allowed'
                      : 'bg-paper-3 hover:bg-lilac-soft'
                }`}
              >
                <span
                  className={`font-stamp uppercase text-[10px] tracking-[0.1em] leading-none ${
                    isSelected ? 'text-paper-3/70' : 'text-ink-soft'
                  }`}
                >
                  {WEEK_DAYS_SHORT[day.getDay()]}
                </span>
                <span className="font-display font-bold text-[19px] leading-none mt-1.5">
                  {day.getDate()}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
