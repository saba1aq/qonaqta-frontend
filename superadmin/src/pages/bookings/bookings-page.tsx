import { useState } from "react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Badge } from "@/shared/ui/badge"
import { Select } from "@/shared/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/shared/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import {
  useBookings,
  useConfirmBooking,
  useCancelBooking,
  useNoShowBooking,
  useCompleteBooking,
} from "@/entities/booking"
import type { Booking } from "@/entities/booking"

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  confirmed: { label: "Подтверждено", variant: "default" },
  pending: { label: "Ожидает", variant: "secondary" },
  completed: { label: "Завершено", variant: "outline" },
  cancelled: { label: "Отменено", variant: "destructive" },
  no_show: { label: "Не пришёл", variant: "destructive" },
}

function BookingRow({ booking }: { booking: Booking }) {
  const confirm = useConfirmBooking()
  const cancel = useCancelBooking()
  const noShow = useNoShowBooking()
  const complete = useCompleteBooking()

  const status = statusMap[booking.status] ?? { label: booking.status, variant: "secondary" as const }

  const startTime = new Date(booking.start_time)
  const date = startTime.toLocaleDateString("ru-RU")
  const time = startTime.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })

  const isPending =
    confirm.isPending || cancel.isPending || noShow.isPending || complete.isPending

  return (
    <TableRow>
      <TableCell className="text-muted-foreground text-sm">{booking.branch_name}</TableCell>
      <TableCell>
        <div>{booking.guest_name}</div>
        <div className="text-muted-foreground text-xs">{booking.guest_phone}</div>
      </TableCell>
      <TableCell>{date}</TableCell>
      <TableCell>{time}</TableCell>
      <TableCell>{booking.guests_count}</TableCell>
      <TableCell>{booking.table_number ?? "-"}</TableCell>
      <TableCell>
        <Badge variant={status.variant}>{status.label}</Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon-sm" disabled={isPending}>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => confirm.mutate(booking.id)}>
              Подтвердить
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => complete.mutate(booking.id)}>
              Завершить
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => noShow.mutate(booking.id)}>
              Не пришёл
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => cancel.mutate(booking.id)}
              className="text-destructive"
            >
              Отменить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}

export function BookingsPage() {
  const [statusFilter, setStatusFilter] = useState("")
  const [date, setDate] = useState("")

  const { data: bookings, isLoading, isError } = useBookings({
    status: statusFilter || undefined,
    date: date || undefined,
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Бронирования</h1>
        <p className="text-muted-foreground">Все бронирования платформы</p>
      </div>

      <div className="flex items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Статус</span>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Все</option>
            <option value="pending">Ожидает</option>
            <option value="confirmed">Подтверждено</option>
            <option value="completed">Завершено</option>
            <option value="cancelled">Отменено</option>
            <option value="no_show">Не пришёл</option>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Дата</span>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        {(statusFilter || date) && (
          <Button
            variant="ghost"
            onClick={() => {
              setStatusFilter("")
              setDate("")
            }}
          >
            Сбросить
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="text-muted-foreground py-8 text-center text-sm">
          Загрузка...
        </div>
      )}

      {isError && (
        <div className="text-destructive py-8 text-center text-sm">
          Ошибка загрузки данных
        </div>
      )}

      {bookings && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Филиал</TableHead>
              <TableHead>Гость</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Время</TableHead>
              <TableHead>Гостей</TableHead>
              <TableHead>Столик</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <BookingRow key={booking.id} booking={booking} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
