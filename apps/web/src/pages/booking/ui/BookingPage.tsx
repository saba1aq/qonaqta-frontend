import { useEffect } from 'react'
import { useParams, useNavigate, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useBranchDetail, useBranchSlots } from '@/entities/restaurant'
import { useBookingFormStore } from '@/features/book-table'
import { Button } from '@qonaqta/ui/components/button'
import { GuestCountSelector } from './GuestCountSelector'
import { CalendarGrid } from './CalendarGrid'
import { TimeSlotPicker } from './TimeSlotPicker'
import { formatDate } from '../lib/time-slots'

function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + days)
  return formatDate(dt)
}

export function BookingPage() {
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const { data: branch } = useBranchDetail(id)

  const { guestCount, date, timeSlot, setGuestCount, setDate, setTimeSlot } =
    useBookingFormStore()

  const { data: timeSlots = [], isFetched } = useBranchSlots(id, date)

  useEffect(() => {
    if (!date || !isFetched || timeSlots.length > 0) return
    const today = formatDate(new Date())
    const lastAllowed = addDays(today, 13)
    if (date < lastAllowed) {
      setDate(addDays(date, 1))
    }
  }, [date, isFetched, timeSlots.length, setDate])

  const canProceed = date && timeSlot

  return (
    <div className="flex flex-col h-svh">
      <div className="shrink-0 px-4 py-3 border-b border-neutral-100 bg-white">
        <div className="flex items-center gap-3">
          <Link
            to="/restaurant/$id"
            params={{ id }}
            className="w-9 h-9 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] font-semibold truncate">{branch?.name ?? ''}</h1>
            <p className="text-[12px] text-neutral-500 truncate">{branch?.address ?? ''}</p>
          </div>
        </div>
        <div className="mt-3 flex gap-1 h-1">
          <div className="flex-1 rounded-full bg-neutral-900" />
          <div className="flex-1 rounded-full bg-neutral-200" />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6">
        <GuestCountSelector count={guestCount} onChange={setGuestCount} />

        <div>
          <h3 className="text-sm font-semibold mb-3">Дата</h3>
          <CalendarGrid
            date={date}
            onSelect={setDate}
            schedules={branch?.schedules}
          />
        </div>

        {date && (
          <TimeSlotPicker
            slots={timeSlots}
            selected={timeSlot}
            onSelect={setTimeSlot}
          />
        )}
      </div>

      <div className="shrink-0 bg-white/80 backdrop-blur-xl border-t border-neutral-100 px-5 py-4">
        <Button
          className={
            canProceed
              ? 'w-full h-13 rounded-2xl text-[15px] font-semibold bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98] transition-all shadow-lg shadow-neutral-900/20'
              : 'w-full h-13 rounded-2xl text-[15px] font-medium bg-neutral-100 text-neutral-400 transition-all'
          }
          disabled={!canProceed}
          onClick={() => navigate({ to: '/restaurant/$id/book/confirm', params: { id } })}
        >
          {!date ? 'Выберите дату' : !timeSlot ? 'Выберите время' : 'Продолжить'}
        </Button>
      </div>
    </div>
  )
}
