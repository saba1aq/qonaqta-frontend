import { useState } from 'react'
import { useParams, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, CheckCircle2, CalendarDays, Users, MapPin } from 'lucide-react'
import { useBranchDetail } from '@/entities/restaurant'
import { useCreateBooking } from '@/entities/booking'
import { useBookingFormStore } from '@/features/book-table'
import { useAuthStore } from '@/entities/user'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

export function ConfirmPage() {
  const { slug } = useParams({ strict: false }) as { slug: string }
  const navigate = useNavigate()
  const { data: branch } = useBranchDetail(slug)
  const createBooking = useCreateBooking()
  const user = useAuthStore((s) => s.user)

  const {
    guestCount,
    date,
    timeSlot,
    guestName,
    guestPhone,
    notes,
    setGuestInfo,
    setNotes,
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
      notes: localNotes || undefined,
    })

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Бронь подтверждена!</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {branch?.name} — {formattedDate}, {timeSlot}
        </p>
        <Button
          className="w-full h-12 rounded-xl text-sm font-semibold"
          onClick={() => {
            reset()
            navigate({ to: '/' })
          }}
        >
          На главную
        </Button>
      </div>
    )
  }

  const canSubmit = localName.trim() && localPhone.trim() && date && timeSlot

  return (
    <div className="pb-24">
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        <Link
          to="/restaurant/$slug/book"
          params={{ slug }}
          className="w-9 h-9 rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-base font-semibold">Подтверждение</h1>
      </div>

      <div className="p-4 space-y-4">
        {branch && (
          <div className="flex gap-3 items-center p-3 bg-secondary rounded-xl">
            {branch.cover_image_url ? (
              <img
                src={branch.cover_image_url}
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
        )}

        <div className="bg-secondary rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              <span>
                {formattedDate}, {timeSlot}
              </span>
            </div>
            <Link
              to="/restaurant/$slug/book"
              params={{ slug }}
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

          <div>
            <label className="text-sm font-medium mb-1 block">Комментарий</label>
            <textarea
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              placeholder="Особые пожелания..."
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-input bg-transparent text-sm outline-none resize-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {createBooking.error && (
          <p className="text-sm text-destructive text-center">
            Нет свободных столиков на это время. Попробуйте другое время.
          </p>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto p-4 bg-white border-t">
        <Button
          className="w-full h-12 rounded-xl text-sm font-semibold"
          disabled={!canSubmit || createBooking.isPending}
          onClick={handleSubmit}
        >
          {createBooking.isPending ? 'Бронирование...' : 'Завершить бронирование'}
        </Button>
      </div>
    </div>
  )
}
