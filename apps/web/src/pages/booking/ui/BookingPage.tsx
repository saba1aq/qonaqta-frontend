import { useEffect } from 'react'
import { useParams, useNavigate, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useBranchDetail, useBranchSlots } from '@/entities/restaurant'
import { useBookingFormStore } from '@/features/book-table'
import { GuestCountSelector } from './GuestCountSelector'
import { CalendarGrid } from './CalendarGrid'
import { TimeSlotPicker } from './TimeSlotPicker'
import { Ticket } from './Ticket'
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

  const canProceed = Boolean(date && timeSlot)

  const formattedDate = date
    ? new Date(date).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })
    : '—'

  return (
    <div className="mx-auto max-w-[1140px] px-[clamp(18px,4vw,44px)] pt-[clamp(22px,3vw,36px)] pb-36">
      <div className="flex items-center justify-between gap-3 mb-4">
        <Link
          to="/restaurant/$id"
          params={{ id }}
          className="flex items-center gap-2 font-stamp uppercase tracking-[0.08em] text-[12px] hover:text-riso-pink transition-colors min-w-0"
        >
          <ArrowLeft className="size-4 shrink-0" />
          <span className="truncate min-w-0">{branch?.name ?? 'Назад'}</span>
        </Link>
        <span className="font-stamp uppercase tracking-[0.1em] text-[12px] text-ink-soft shrink-0">
          Шаг 1 / 2
        </span>
      </div>

      <div className="border-t-2 border-ink pt-[clamp(20px,3vw,32px)] grid lg:grid-cols-[minmax(0,1fr)_0.72fr] gap-[clamp(24px,4vw,52px)] items-start">
        <div className="space-y-8 min-w-0">
          <h1 className="font-display font-bold tracking-[-0.035em] text-[clamp(26px,4.5vw,42px)]">
            Дата, время и гости
          </h1>
          <GuestCountSelector count={guestCount} onChange={setGuestCount} />
          <CalendarGrid date={date} onSelect={setDate} schedules={branch?.schedules} />
          {date && <TimeSlotPicker slots={timeSlots} selected={timeSlot} onSelect={setTimeSlot} />}
        </div>

        <div className="lg:sticky lg:top-24 min-w-0 pr-1">
          <div className="font-stamp uppercase tracking-[0.12em] text-[12px] text-ink-soft mb-3">
            Ваш талон
          </div>
          <Ticket
            branchName={branch?.name ?? '—'}
            address={branch?.address}
            formattedDate={formattedDate}
            timeSlot={timeSlot}
            guestCount={guestCount}
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 bg-paper/90 backdrop-blur-md border-t-2 border-ink">
        <div className="mx-auto max-w-[1140px] px-[clamp(18px,4vw,44px)] py-3.5 flex justify-end">
          <button
            disabled={!canProceed}
            onClick={() => navigate({ to: '/restaurant/$id/book/confirm', params: { id } })}
            className={`w-full sm:w-auto font-display font-bold text-[15px] px-7 py-4 transition-all ${
              canProceed
                ? 'bg-ink text-paper-3 shadow-[6px_6px_0_#f2315d] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#f2315d]'
                : 'bg-paper-2 text-ink-soft border-2 border-ink cursor-not-allowed'
            }`}
          >
            {!date ? 'Выберите дату' : !timeSlot ? 'Выберите время' : 'Продолжить →'}
          </button>
        </div>
      </div>
    </div>
  )
}
