import { useParams, useNavigate, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useBranchDetail, useBranchSlots } from '@/entities/restaurant'
import { useBookingFormStore } from '@/features/book-table'
import { Button } from '@qonaqta/ui/components/button'
import { GuestCountSelector } from './GuestCountSelector'
import { CalendarGrid } from './CalendarGrid'
import { TimeSlotPicker } from './TimeSlotPicker'

export function BookingPage() {
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const { data: branch } = useBranchDetail(id)

  const { guestCount, date, timeSlot, setGuestCount, setDate, setTimeSlot } =
    useBookingFormStore()

  const { data: timeSlots = [] } = useBranchSlots(id, date)

  const canProceed = date && timeSlot

  return (
    <div className="pb-24">
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        <Link
          to="/restaurant/$id"
          params={{ id }}
          className="w-9 h-9 rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-base font-semibold">Детали бронирования</h1>
      </div>

      <div className="p-4 space-y-6">
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

      <div className="fixed bottom-0 left-0 right-0 max-w-120 mx-auto z-30">
        <div className="bg-white/80 backdrop-blur-xl border-t border-neutral-100 px-5 py-4">
          <Button
            className="w-full h-13 rounded-2xl text-[15px] font-semibold bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98] transition-all shadow-lg shadow-neutral-900/20"
            disabled={!canProceed}
            onClick={() => navigate({ to: '/restaurant/$id/book/confirm', params: { id } })}
          >
            Продолжить
          </Button>
        </div>
      </div>
    </div>
  )
}
