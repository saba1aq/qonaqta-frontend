import type { BranchStatus } from '@/entities/restaurant'

const WEEKDAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function nextOpenSubLabel(days: number | null, openAt: string | null): string {
  if (!openAt) return ''
  if (days === 0) return `с ${openAt}`
  if (days === 1) return `завтра в ${openAt}`

  const today = new Date()
  const target = new Date(today)
  target.setDate(today.getDate() + (days ?? 0))
  const wd = (target.getDay() + 6) % 7
  return `${WEEKDAY_NAMES[wd]} в ${openAt}`
}

export function StatusChip({ status }: { status: BranchStatus }) {
  if (status.state === 'open') {
    return (
      <div className="flex flex-col items-end pt-1 shrink-0">
        <div className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-neutral-900 animate-pulse" />
          <span className="text-[12px] font-semibold text-neutral-900">Открыто</span>
        </div>
        {status.open_until && (
          <span className="text-[11px] text-neutral-400 mt-0.5">до {status.open_until}</span>
        )}
      </div>
    )
  }

  if (status.state === 'closing_soon') {
    return (
      <div className="flex flex-col items-end pt-1 shrink-0">
        <div className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-neutral-900 animate-pulse" />
          <span className="text-[12px] font-semibold text-neutral-900">
            {status.closes_in_minutes} мин
          </span>
        </div>
        <span className="text-[11px] text-neutral-400 mt-0.5">до закрытия</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end pt-1 shrink-0">
      <div className="flex items-center gap-1">
        <span className="size-1.5 rounded-full bg-neutral-300" />
        <span className="text-[12px] font-semibold text-neutral-500">Закрыто</span>
      </div>
      <span className="text-[11px] text-neutral-400 mt-0.5">
        {nextOpenSubLabel(status.opens_in_days, status.opens_at)}
      </span>
    </div>
  )
}
