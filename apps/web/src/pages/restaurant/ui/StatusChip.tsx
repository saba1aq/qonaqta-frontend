import type { BranchStatus } from '@/entities/restaurant'

const WEEKDAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function formatOpensIn(days: number | null, openAt: string | null): string {
  if (!openAt) return 'Закрыто'
  if (days === 0) return `Откроется в ${openAt}`
  if (days === 1) return `Откроется завтра в ${openAt}`

  const today = new Date()
  const target = new Date(today)
  target.setDate(today.getDate() + (days ?? 0))
  const wd = (target.getDay() + 6) % 7
  return `Откроется в ${WEEKDAY_NAMES[wd]} в ${openAt}`
}

export function StatusChip({ status }: { status: BranchStatus }) {
  if (status.state === 'open') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[12px] font-medium">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Открыто {status.open_until && <span className="text-emerald-600/80">· до {status.open_until}</span>}
      </span>
    )
  }

  if (status.state === 'closing_soon') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[12px] font-medium">
        <span className="size-1.5 rounded-full bg-amber-500" />
        Закроется через {status.closes_in_minutes} мин
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 text-[12px] font-medium">
      <span className="size-1.5 rounded-full bg-neutral-400" />
      Закрыто <span className="text-neutral-500">· {formatOpensIn(status.opens_in_days, status.opens_at)}</span>
    </span>
  )
}
