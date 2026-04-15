import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { BranchSchedule } from '@/entities/restaurant'

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export function ScheduleSection({ schedules }: { schedules: BranchSchedule[] }) {
  const [expanded, setExpanded] = useState(false)
  const sorted = [...schedules].sort((a, b) => a.day_of_week - b.day_of_week)
  const todayDow = new Date().getDay() === 0 ? 7 : new Date().getDay()
  const todaySchedule = schedules.find((s) => s.day_of_week === todayDow)

  if (sorted.length === 0) return null

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between mb-3"
      >
        <h3 className="text-[15px] font-semibold text-neutral-900">Режим работы</h3>
        <div className="flex items-center gap-1 text-xs text-neutral-400">
          {!expanded && todaySchedule && !todaySchedule.is_closed && (
            <span>
              {todaySchedule.open_time.slice(0, 5)} — {todaySchedule.close_time.slice(0, 5)}
            </span>
          )}
          <ChevronDown className={`size-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {expanded && (
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
  )
}
