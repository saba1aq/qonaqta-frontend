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
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-neutral-900">{headerLabel}</h3>
        <CalendarDays className="size-5 text-neutral-500" />
      </div>

      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2 min-w-max">
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
                className={`flex flex-col items-center justify-center w-12 h-16 rounded-xl shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-foreground text-white'
                    : isClosed
                      ? 'text-red-400'
                      : 'text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <span className="text-lg font-bold leading-none">{day.getDate()}</span>
                <span
                  className={`text-[11px] mt-1 leading-none ${
                    isSelected ? 'text-white/70' : isClosed ? 'text-red-400/70' : 'text-neutral-400'
                  }`}
                >
                  {WEEK_DAYS_SHORT[day.getDay()]}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
