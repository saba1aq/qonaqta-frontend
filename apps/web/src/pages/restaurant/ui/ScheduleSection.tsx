import type { BranchSchedule } from '@/entities/restaurant'

const DAY_NAMES = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']

export function ScheduleSection({
  schedules,
  todayDow,
}: {
  schedules: BranchSchedule[]
  todayDow: number | null
}) {
  const sorted = [...schedules].sort((a, b) => a.day_of_week - b.day_of_week)
  if (sorted.length === 0) return null

  return (
    <div>
      <h3 className="font-stamp uppercase tracking-[0.12em] text-[12px] text-ink-soft mb-3">
        Часы работы
      </h3>
      <div className="border-t-2 border-ink">
        {sorted.map((s) => {
          const isToday = s.day_of_week === todayDow
          return (
            <div
              key={s.day_of_week}
              className={`flex justify-between items-center text-[14px] py-2.5 border-b border-ink/20 ${
                isToday ? 'bg-riso-sun font-semibold px-2 -mx-2' : ''
              }`}
            >
              <span>{DAY_NAMES[s.day_of_week - 1]}</span>
              {s.is_closed ? (
                <span className="text-ink-soft font-stamp uppercase text-[12px] tracking-wide">
                  Закрыто
                </span>
              ) : (
                <span className="font-stamp tracking-[0.04em] tabular-nums">
                  {s.open_time.slice(0, 5)} — {s.close_time.slice(0, 5)}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
