import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useBranchDetail } from '@/entities/restaurant'
import { useCreateBooking } from '@/entities/booking'
import { useBookingFormStore } from '@/features/book-table'
import { useAuthStore } from '@/entities/user'
import { BookingSuccess } from './BookingSuccess'
import { Ticket } from './Ticket'

const inputCls =
  'w-full border-2 border-ink bg-paper-3 px-4 py-3 text-[15px] text-ink outline-none placeholder:text-ink-soft focus:shadow-[3px_3px_0_#eec0ff] transition-shadow'
const labelCls = 'font-stamp uppercase tracking-[0.1em] text-[11px] text-ink-soft mb-2 block'

export function ConfirmPage() {
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const { data: branch } = useBranchDetail(id)
  const createBooking = useCreateBooking()
  const user = useAuthStore((s) => s.user)

  const {
    guestCount,
    date,
    timeSlot,
    guestName,
    guestPhone,
    notes,
    contactMethod,
    setGuestInfo,
    setNotes,
    setContactMethod,
    reset,
  } = useBookingFormStore()

  const [localName, setLocalName] = useState(guestName || user?.first_name || '')
  const [localPhone, setLocalPhone] = useState(guestPhone || user?.phone || '')
  const [localNotes, setLocalNotes] = useState(notes)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('booking_completed') === '1') {
      sessionStorage.removeItem('booking_completed')
      reset()
      navigate({ to: '/restaurants' })
    }
  }, [reset, navigate])

  const formattedDate = date
    ? new Date(date).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })
    : ''

  const handleSubmit = async () => {
    if (!branch || !date || !timeSlot) return

    setGuestInfo(localName, localPhone)
    setNotes(localNotes)

    await createBooking.mutateAsync({
      branch_id: branch.id,
      date,
      time_slot: timeSlot,
      guest_count: guestCount,
      guest_name: localName,
      guest_phone: localPhone,
      contact_method: branch.whatsapp ? contactMethod : 'phone',
      notes: localNotes || undefined,
    })

    sessionStorage.setItem('booking_completed', '1')
    setSuccess(true)
  }

  if (success) {
    return (
      <BookingSuccess
        branchName={branch?.name}
        branchAddress={branch?.address}
        formattedDate={formattedDate}
        timeSlot={timeSlot}
        guestCount={guestCount}
        onGoHome={() => {
          sessionStorage.removeItem('booking_completed')
          reset()
          navigate({ to: '/restaurants' })
        }}
      />
    )
  }

  const phoneDigits = localPhone.replace(/\D/g, '')
  const canSubmit = Boolean(localName.trim() && phoneDigits.length === 11 && date && timeSlot)

  return (
    <div className="mx-auto max-w-[1140px] px-[clamp(18px,4vw,44px)] pt-[clamp(22px,3vw,36px)] pb-36">
      <div className="flex items-center justify-between gap-3 mb-4">
        <Link
          to="/restaurant/$id/book"
          params={{ id }}
          className="flex items-center gap-2 font-stamp uppercase tracking-[0.08em] text-[12px] hover:text-ink-soft transition-colors min-w-0"
        >
          <ArrowLeft className="size-4 shrink-0" />
          <span className="truncate min-w-0">{branch?.name ?? 'Назад'}</span>
        </Link>
        <span className="font-stamp uppercase tracking-[0.1em] text-[12px] text-ink-soft shrink-0">
          Шаг 2 / 2
        </span>
      </div>

      <div className="border-t-2 border-ink pt-[clamp(20px,3vw,32px)] grid lg:grid-cols-[minmax(0,1fr)_0.72fr] gap-[clamp(24px,4vw,52px)] items-start">
        <div className="space-y-5 max-w-[520px] min-w-0">
          <h1 className="font-display font-bold tracking-[-0.035em] text-[clamp(26px,4.5vw,42px)]">
            Ваши данные
          </h1>

          <div>
            <label className={labelCls}>Имя</label>
            <input
              value={localName}
              onChange={(e) =>
                setLocalName(
                  e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁәғқңөұүһіӘҒҚҢӨҰҮҺІ\s-]/g, ''),
                )
              }
              placeholder="Ваше имя"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Телефон</label>
            <input
              value={localPhone}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 11)
                const d = digits.startsWith('7') ? digits : '7' + digits.replace(/^[78]/, '')
                let formatted = '+7'
                if (d.length > 1) formatted += ' (' + d.slice(1, 4)
                if (d.length > 4) formatted += ') ' + d.slice(4, 7)
                if (d.length > 7) formatted += '-' + d.slice(7, 9)
                if (d.length > 9) formatted += '-' + d.slice(9, 11)
                setLocalPhone(formatted)
              }}
              placeholder="+7 (___) ___-__-__"
              type="tel"
              className={`${inputCls} tabular-nums`}
            />
          </div>

          {branch?.whatsapp && (
            <div>
              <label className={labelCls}>Способ связи</label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    ['phone', 'Позвонить мне'],
                    ['whatsapp', 'Написать в WhatsApp'],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setContactMethod(value)}
                    className={`border-2 border-ink px-4 py-3 text-[14px] font-medium text-left transition-colors ${
                      contactMethod === value ? 'bg-ink text-paper-3' : 'bg-paper-3 hover:bg-lilac-soft'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className={labelCls}>
              Комментарий <span className="normal-case tracking-normal">(необязательно)</span>
            </label>
            <textarea
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              placeholder="Особые пожелания…"
              rows={2}
              className={`${inputCls} resize-none`}
            />
          </div>

          {createBooking.error && (
            <div role="alert" className="border-2 border-danger bg-danger/8 px-4 py-3 text-[14px] text-danger">
              Нет свободных столиков на это время. Попробуйте другое время.
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 min-w-0 pr-1">
          <div className="font-stamp uppercase tracking-[0.12em] text-[12px] text-ink-soft mb-3">
            Детали брони
          </div>
          <Ticket
            branchName={branch?.name ?? '—'}
            address={branch?.address}
            formattedDate={formattedDate}
            timeSlot={timeSlot}
            guestCount={guestCount}
            stamp="Ожидает"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 bg-paper/90 backdrop-blur-md border-t-2 border-ink">
        <div className="mx-auto max-w-[1140px] px-[clamp(18px,4vw,44px)] py-3.5 flex justify-end">
          <button
            disabled={!canSubmit || createBooking.isPending}
            onClick={handleSubmit}
            className={`w-full sm:w-auto font-display font-bold text-[15px] px-7 py-4 transition-all ${
              canSubmit && !createBooking.isPending
                ? 'bg-ink text-paper-3 shadow-[6px_6px_0_#eec0ff] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#eec0ff]'
                : 'bg-paper-2 text-ink-soft border-2 border-ink cursor-not-allowed'
            }`}
          >
            {createBooking.isPending ? 'Бронирование…' : 'Подтвердить бронь →'}
          </button>
        </div>
      </div>
    </div>
  )
}
