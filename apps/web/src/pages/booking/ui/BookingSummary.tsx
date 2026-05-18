import { CalendarDays, Clock, User } from 'lucide-react'
import type { BranchDetail } from '@/entities/restaurant'

export function BookingSummary({
  branch,
  formattedDate,
  timeSlot,
  guestCount,
}: {
  branch: BranchDetail
  formattedDate: string
  timeSlot: string | null
  guestCount: number
  id: string
}) {
  const guestLabel =
    guestCount === 1 ? 'гость' : guestCount >= 2 && guestCount <= 4 ? 'гостя' : 'гостей'

  return (
    <div>
      <h2 className="text-[24px] font-bold text-neutral-900 leading-tight tracking-tight">
        {branch.name}
      </h2>
      <p className="text-[13px] text-neutral-500 mt-1">{branch.address}</p>

      <div className="mt-3 flex items-center gap-3 text-[13px] text-neutral-700">
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
    </div>
  )
}
