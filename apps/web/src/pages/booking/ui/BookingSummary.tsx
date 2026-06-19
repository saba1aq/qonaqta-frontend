import { CalendarDays, Clock, User } from 'lucide-react'

export function BookingSummary({
  formattedDate,
  timeSlot,
  guestCount,
}: {
  formattedDate: string
  timeSlot: string | null
  guestCount: number
}) {
  const guestLabel =
    guestCount === 1 ? 'гость' : guestCount >= 2 && guestCount <= 4 ? 'гостя' : 'гостей'

  return (
    <div className="flex items-center gap-3 text-[13px] text-neutral-700">
      <span className="flex items-center gap-1.5">
        <CalendarDays className="size-3.5 text-neutral-400" />
        <span className="font-medium">{formattedDate}</span>
      </span>
      <span className="text-neutral-200">·</span>
      <span className="flex items-center gap-1.5">
        <Clock className="size-3.5 text-neutral-400" />
        <span className="font-medium tabular-nums">{timeSlot}</span>
      </span>
      <span className="text-neutral-200">·</span>
      <span className="flex items-center gap-1.5">
        <User className="size-3.5 text-neutral-400" />
        <span className="font-medium">{guestCount} {guestLabel}</span>
      </span>
    </div>
  )
}
