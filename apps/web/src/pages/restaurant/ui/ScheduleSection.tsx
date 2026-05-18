import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { BranchSchedule } from '@/entities/restaurant'

const DAY_NAMES = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']

export function ScheduleSection({
  schedules,
  todayDow,
}: {
  schedules: BranchSchedule[]
  todayDow: number | null
}) {
  const [expanded, setExpanded] = useState(false)
  const sorted = [...schedules].sort((a, b) => a.day_of_week - b.day_of_week)
  const todaySchedule = todayDow !== null ? schedules.find((s) => s.day_of_week === todayDow) : undefined

  if (sorted.length === 0) return null

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <h3 className="text-[15px] font-semibold text-neutral-900">Режим работы</h3>
        <div className="flex items-center gap-2">
          {!expanded && todaySchedule && !todaySchedule.is_closed && (
            <span className="text-[13px] font-medium text-neutral-700 tabular-nums">
              {todaySchedule.open_time.slice(0, 5)}<span className="text-neutral-300 mx-1">–</span>{todaySchedule.close_time.slice(0, 5)}
            </span>
          )}
          <ChevronDown className={`size-4 text-neutral-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {expanded && (
        <div className="mt-3 rounded-2xl bg-neutral-50 p-4 space-y-2.5">
          {sorted.map((s) => {
            const isToday = s.day_of_week === todayDow
            return (
              <div
                key={s.day_of_week}
                className={`flex justify-between items-center text-sm ${
                  isToday ? 'font-semibold text-neutral-900' : 'text-neutral-500'
                }`}
              >
                <span>{DAY_NAMES[s.day_of_week - 1]}</span>
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
