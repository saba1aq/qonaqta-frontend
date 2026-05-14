import { useState } from 'react'
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

    setSuccess(true)
  }

  if (success) {
    return (
      <BookingSuccess
        branchName={branch?.name}
        formattedDate={formattedDate}
        timeSlot={timeSlot}
        onGoHome={() => {
          reset()
          navigate({ to: '/' })
        }}
      />
    )
  }

  const canSubmit = localName.trim() && localPhone.trim() && date && timeSlot

  return (
    <div className="pb-24">
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        <Link
          to="/restaurant/$id/book"
          params={{ id }}
          className="w-9 h-9 rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-base font-semibold">Подтверждение</h1>
      </div>

      <div className="p-4 space-y-4">
        {branch && (
          <BookingSummary
            branch={branch}
            formattedDate={formattedDate}
            timeSlot={timeSlot}
            guestCount={guestCount}
            id={id}
          />
        )}

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Имя</label>
            <Input
              value={localName}
              onChange={(e) => setLocalName(e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁәғқңөұүһіӘҒҚҢӨҰҮҺІ\s-]/g, ''))}
              placeholder="Ваше имя"
              className="h-11 rounded-xl"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Телефон</label>
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
              className="h-11 rounded-xl"
            />
          </div>

          {branch?.whatsapp && (
            <div>
              <label className="text-sm font-semibold mb-2 block">Способ связи</label>
              <div className="rounded-2xl border border-neutral-200 bg-white divide-y divide-neutral-100">
                <button
                  type="button"
                  onClick={() => setContactMethod('phone')}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left"
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
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left"
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
            <label className="text-sm font-medium mb-1 block">Комментарий</label>
            <textarea
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              placeholder="Особые пожелания..."
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-input bg-transparent text-base md:text-sm outline-none resize-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {createBooking.error && (
          <p className="text-sm text-destructive text-center">
            Нет свободных столиков на это время. Попробуйте другое время.
          </p>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-120 mx-auto z-30">
        <div className="bg-white/80 backdrop-blur-xl border-t border-neutral-100 px-5 py-4">
          <Button
            className="w-full h-13 rounded-2xl text-[15px] font-semibold bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98] transition-all shadow-lg shadow-neutral-900/20"
            disabled={!canSubmit || createBooking.isPending}
            onClick={handleSubmit}
          >
            {createBooking.isPending ? 'Бронирование...' : 'Подтвердить'}
          </Button>
        </div>
      </div>
    </div>
  )
}
