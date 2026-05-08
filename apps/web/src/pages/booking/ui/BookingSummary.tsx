import { Link } from '@tanstack/react-router'
import { CalendarDays, Users, MapPin } from 'lucide-react'
import type { BranchDetail } from '@/entities/restaurant'

export function BookingSummary({
  branch,
  formattedDate,
  timeSlot,
  guestCount,
  id,
}: {
  branch: BranchDetail
  formattedDate: string
  timeSlot: string | null
  guestCount: number
  id: string
}) {
  return (
    <>
      <div className="flex gap-3 items-center p-3 bg-secondary rounded-xl">
        {branch.photos.length > 0 ? (
          <img
            src={branch.photos[0].image_url}
            alt={branch.name}
            className="w-14 h-14 rounded-lg object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-muted" />
        )}
        <div>
          <p className="text-sm font-semibold">{branch.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {branch.address}
          </p>
        </div>
      </div>

      <div className="bg-secondary rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <span>
              {formattedDate}, {timeSlot}
            </span>
          </div>
          <Link
            to="/restaurant/$id/book"
            params={{ id }}
            className="text-xs text-primary underline"
          >
            Изменить
          </Link>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>{guestCount} гостей</span>
        </div>
      </div>
    </>
  )
}
