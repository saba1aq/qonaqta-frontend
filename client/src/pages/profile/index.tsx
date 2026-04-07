import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, LogOut, Calendar, Clock, MapPin } from 'lucide-react'
import { useAuthStore } from '@/entities/user'
import { useMyBookings, useCancelBooking } from '@/entities/booking'
import { Button } from '@/shared/ui/button'

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  confirmed: { label: 'Подтверждено', color: 'bg-green-100 text-green-700' },
  pending: { label: 'Ожидание', color: 'bg-yellow-100 text-yellow-700' },
  cancelled: { label: 'Отменено', color: 'bg-red-100 text-red-700' },
  completed: { label: 'Завершено', color: 'bg-secondary text-secondary-foreground' },
  no_show: { label: 'Не пришёл', color: 'bg-muted text-muted-foreground' },
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { data: bookings, isLoading } = useMyBookings()
  const cancelBooking = useCancelBooking()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-xl font-bold mb-2">Войдите в аккаунт</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Чтобы увидеть свои бронирования
        </p>
        <Link to="/auth">
          <Button className="h-12 rounded-xl px-8 text-sm font-semibold">Войти</Button>
        </Link>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }

  const handleCancel = (bookingId: string) => {
    cancelBooking.mutate(bookingId)
  }

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <Link to="/" className="w-9 h-9 rounded-full flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-base font-semibold">Профиль</h1>
        </div>
        <button onClick={handleLogout} className="text-muted-foreground">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <div className="bg-secondary rounded-xl p-4 mb-6">
          <p className="font-semibold text-base">
            {user?.first_name || 'Пользователь'}
            {user?.last_name ? ` ${user.last_name}` : ''}
          </p>
          <p className="text-sm text-muted-foreground">{user?.phone}</p>
        </div>

        <h2 className="text-lg font-semibold mb-3">Мои бронирования</h2>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : !bookings?.length ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Бронирований пока нет
          </p>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const statusInfo = STATUS_MAP[booking.status] ?? {
                label: booking.status,
                color: 'bg-muted text-muted-foreground',
              }

              const canCancel =
                booking.status === 'confirmed' || booking.status === 'pending'

              return (
                <div key={booking.id} className="border border-border rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      Бронь #{booking.id.slice(0, 8)}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(booking.date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {booking.time_slot}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {booking.guest_count} гостей
                    </span>
                  </div>

                  {canCancel && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-lg text-xs"
                      disabled={cancelBooking.isPending}
                      onClick={() => handleCancel(booking.id)}
                    >
                      Отменить
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
