import {
  UtensilsCrossed,
  CalendarCheck,
  Users,
  Building2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { Badge } from "@/shared/ui/badge"
import { useBookings } from "@/entities/booking"
import { useRestaurants } from "@/entities/restaurant"
import { useUsers } from "@/entities/user"
import type { Booking } from "@/entities/booking"

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  confirmed: { label: "Подтверждено", variant: "default" },
  pending: { label: "Ожидает", variant: "secondary" },
  completed: { label: "Завершено", variant: "outline" },
  cancelled: { label: "Отменено", variant: "destructive" },
  no_show: { label: "Не пришёл", variant: "destructive" },
}

function formatTime(isoString: string) {
  const d = new Date(isoString)
  return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
}

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleDateString("ru-RU")
}

export function DashboardPage() {
  const today = new Date().toISOString().slice(0, 10)

  const { data: todayBookings } = useBookings({ date: today })
  const { data: restaurants } = useRestaurants()
  const { data: users } = useUsers()

  const totalRestaurants = restaurants?.length ?? "-"
  const totalUsers = users?.length ?? "-"
  const todayCount = todayBookings?.length ?? "-"

  const activeBranches = "-"

  const recentBookings: Booking[] = todayBookings?.slice(0, 10) ?? []

  const stats = [
    { label: "Всего ресторанов", value: String(totalRestaurants), icon: UtensilsCrossed },
    { label: "Бронирований сегодня", value: String(todayCount), icon: CalendarCheck },
    { label: "Всего пользователей", value: String(totalUsers), icon: Users },
    { label: "Активных филиалов", value: String(activeBranches), icon: Building2 },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Дашборд</h1>
        <p className="text-muted-foreground">Общая статистика платформы</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Последние бронирования</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              Нет бронирований на сегодня
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Филиал</TableHead>
                  <TableHead>Гость</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Время</TableHead>
                  <TableHead>Столик</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => {
                  const status = statusMap[booking.status] ?? {
                    label: booking.status,
                    variant: "secondary" as const,
                  }
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.branch_name}</TableCell>
                      <TableCell>
                        <div>{booking.guest_name}</div>
                        <div className="text-muted-foreground text-xs">{booking.guest_phone}</div>
                      </TableCell>
                      <TableCell>{formatDate(booking.start_time)}</TableCell>
                      <TableCell>{formatTime(booking.start_time)}</TableCell>
                      <TableCell>{booking.table_number ?? "-"}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
