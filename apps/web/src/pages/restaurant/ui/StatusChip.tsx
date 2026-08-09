import type { BranchStatus } from '@/entities/restaurant'

const WEEKDAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function nextOpenSubLabel(days: number | null, openAt: string | null): string {
  if (!openAt) return ''
  if (days === 0) return `с ${openAt}`
  if (days === 1) return `завтра ${openAt}`

  const today = new Date()
  const target = new Date(today)
  target.setDate(today.getDate() + (days ?? 0))
  const wd = (target.getDay() + 6) % 7
  return `${WEEKDAY_NAMES[wd]} ${openAt}`
}

const stampBase =
  'inline-block font-stamp uppercase tracking-[0.08em] text-[12px] font-semibold px-3 py-1.5 -rotate-2'

export function StatusChip({ status }: { status: BranchStatus }) {
  if (status.state === 'open') {
    return (
      <span className={`${stampBase} bg-lilac text-ink`}>
        Открыто{status.open_until ? ` · до ${status.open_until}` : ''}
      </span>
    )
  }

  if (status.state === 'closing_soon') {
    return (
      <span className={`${stampBase} bg-ink text-paper`}>
        Закрывается через {status.closes_in_minutes} мин
      </span>
    )
  }

  return (
    <span className={`${stampBase} bg-paper-2 text-ink-soft border-2 border-ink rotate-0`}>
      Закрыто{status.opens_at ? ` · ${nextOpenSubLabel(status.opens_in_days, status.opens_at)}` : ''}
    </span>
  )
}
