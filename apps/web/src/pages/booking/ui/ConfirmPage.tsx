import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useBranchDetail } from '@/entities/restaurant'
import { useCreateBooking } from '@/entities/booking'
import { useBookingFormStore } from '@/features/book-table'
import { useAuthStore } from '@/entities/user'
import { Button } from '@qonaqta/ui/components/button'
import { Input } from '@qonaqta/ui/components/input'
import { BookingSuccess } from './BookingSuccess'
import { BookingSummary } from './BookingSummary'

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
    ? new Date(date).toLocaleDateString('ru-RU', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
      })
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
  const canSubmit = localName.trim() && phoneDigits.length === 11 && date && timeSlot

  return (
    <div className="flex flex-col h-svh">
      <div className="shrink-0 px-4 py-3 border-b border-neutral-100 bg-white">
        <div className="flex items-center gap-3">
          <Link
            to="/restaurant/$id/book"
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
          <div className="flex-1 rounded-full bg-neutral-900" />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-5 pt-5 space-y-3.5">
        <div className="space-y-3">
          <h2 className="text-[20px] font-bold text-neutral-900">Детали брони</h2>
          {branch && (
            <BookingSummary
              formattedDate={formattedDate}
              timeSlot={timeSlot}
              guestCount={guestCount}
            />
          )}
        </div>

        <h2 className="text-[20px] font-bold text-neutral-900 pt-2">Ваши данные</h2>

        <div>
          <label className="text-[13px] font-medium text-neutral-600 mb-1.5 block">Имя</label>
          <Input
            value={localName}
            onChange={(e) => setLocalName(e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁәғқңөұүһіӘҒҚҢӨҰҮҺІ\s-]/g, ''))}
            placeholder="Ваше имя"
            className="h-11 rounded-xl"
          />
        </div>

        <div>
          <label className="text-[13px] font-medium text-neutral-600 mb-1.5 block">Телефон</label>
          <Input
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
            className="h-11 rounded-xl tabular-nums"
          />
        </div>

        {branch?.whatsapp && (
          <div>
            <label className="text-[13px] font-medium text-neutral-600 mb-1.5 block">Способ связи</label>
            <div className="rounded-2xl border border-neutral-200 bg-white divide-y divide-neutral-100">
              <button
                type="button"
                onClick={() => setContactMethod('phone')}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-[14px] text-neutral-900">Позвонить мне</span>
                <span
                  className={
                    'size-5 rounded-full border-2 flex items-center justify-center transition-colors ' +
                    (contactMethod === 'phone' ? 'border-neutral-900' : 'border-neutral-300')
                  }
                >
                  {contactMethod === 'phone' && <span className="size-2.5 rounded-full bg-neutral-900" />}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setContactMethod('whatsapp')}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-[14px] text-neutral-900">Написать в WhatsApp</span>
                <span
                  className={
                    'size-5 rounded-full border-2 flex items-center justify-center transition-colors ' +
                    (contactMethod === 'whatsapp' ? 'border-neutral-900' : 'border-neutral-300')
                  }
                >
                  {contactMethod === 'whatsapp' && <span className="size-2.5 rounded-full bg-neutral-900" />}
                </span>
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="text-[13px] font-medium text-neutral-600 mb-1.5 block">
            Комментарий <span className="text-neutral-300 font-normal">(необязательно)</span>
          </label>
          <textarea
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            placeholder="Особые пожелания..."
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-base md:text-sm outline-none resize-none focus:border-neutral-400 placeholder:text-neutral-300"
          />
        </div>

        {createBooking.error && (
          <p className="text-sm text-destructive text-center px-5 pb-3">
            Нет свободных столиков на это время. Попробуйте другое время.
          </p>
        )}
        </div>
      </div>

      <div className="shrink-0 bg-white/80 backdrop-blur-xl border-t border-neutral-100 px-5 py-4">
        <Button
          className={
            canSubmit
              ? 'w-full h-13 rounded-2xl text-[15px] font-semibold bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98] transition-all shadow-lg shadow-neutral-900/20'
              : 'w-full h-13 rounded-2xl text-[15px] font-medium bg-neutral-100 text-neutral-400 transition-all'
          }
          disabled={!canSubmit || createBooking.isPending}
          onClick={handleSubmit}
        >
          {createBooking.isPending ? 'Бронирование...' : 'Подтвердить'}
        </Button>
      </div>
    </div>
  )
}
