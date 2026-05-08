import { useState, useMemo, useRef, useEffect } from "react"
import { CalendarCheck, Users } from "lucide-react"
import { cn } from "@qonaqta/ui/lib/utils"
import {
  useAdminBookings,
  useUpdateBookingStatus,
  BOOKING_STATUSES,
  type BookingStatus,
} from "@/features/bookings"
import { useRestaurants } from "@/features/restaurants"

function StatusSelect({ value, bookingId }: { value: BookingStatus; bookingId: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const mutation = useUpdateBookingStatus()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const current = BOOKING_STATUSES.find((s) => s.value === value)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity",
          current?.color,
          mutation.isPending && "opacity-50"
        )}
      >
        {current?.label}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-10 mt-1 w-36 rounded-xl border border-neutral-200 bg-white py-1 shadow-lg">
          {BOOKING_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => {
                if (s.value !== value) mutation.mutate({ id: bookingId, status: s.value })
                setOpen(false)
              }}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-neutral-50",
                s.value === value && "font-medium"
              )}
            >
              <span className={cn("size-2 rounded-full", s.color.split(" ")[0])} />
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function BookingsPage() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("")
  const [branchFilter, setBranchFilter] = useState<number | "">("")

  const filters = useMemo(() => {
    const f: Record<string, unknown> = { limit: 50 }
    if (selectedDate) f.date = selectedDate
    if (statusFilter) f.status = statusFilter
    if (branchFilter) f.branch_id = branchFilter
    return f
  }, [selectedDate, statusFilter, branchFilter])

  const { data: bookings, isLoading } = useAdminBookings(filters as never)
  const { data: restaurants } = useRestaurants()

  const restaurantMap = useMemo(() => {
    const map: Record<number, string> = {}
    restaurants?.forEach((r) => { map[r.id] = r.name })
    return map
  }, [restaurants])

  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">Брони</h1>
        <p className="mt-0.5 text-[13px] text-neutral-400">Все бронирования на платформе</p>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as BookingStatus | "")}
          className="h-9 rounded-xl border border-neutral-200 bg-white px-3 text-[13px] text-neutral-700 outline-none focus:border-neutral-300"
        >
          <option value="">Все статусы</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value ? Number(e.target.value) : "")}
          className="h-9 rounded-xl border border-neutral-200 bg-white px-3 text-[13px] text-neutral-700 outline-none focus:border-neutral-300"
        >
          <option value="">Все рестораны</option>
          {restaurants?.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>

        {selectedDate && (
          <button
            onClick={() => setSelectedDate(undefined)}
            className="h-9 rounded-xl border border-neutral-200 bg-white px-3 text-[13px] text-neutral-500 hover:bg-neutral-50 transition-colors"
          >
            {selectedDate} &times;
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[52px] animate-pulse rounded-xl bg-neutral-100" />
          ))}
        </div>
      ) : !bookings || bookings.length === 0 ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white/50 py-20">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-neutral-100">
            <CalendarCheck className="size-6 text-neutral-300" />
          </div>
          <p className="mt-4 text-sm text-neutral-400">Нет бронирований</p>
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                <th className="px-4 py-3 text-left font-medium text-neutral-500">Гость</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500">Телефон</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500">Ресторан</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500">Дата</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500">Время</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500">
                  <Users className="inline size-3.5" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500">Статус</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-neutral-50 hover:bg-neutral-50/50">
                  <td className="px-4 py-3 font-medium text-neutral-900">{b.guest_name}</td>
                  <td className="px-4 py-3 text-neutral-500 tabular-nums">{b.guest_phone}</td>
                  <td className="px-4 py-3 text-neutral-500">{restaurantMap[b.branch_id] || b.branch_id}</td>
                  <td className="px-4 py-3 text-neutral-500 tabular-nums">{b.date}</td>
                  <td className="px-4 py-3 text-neutral-500 tabular-nums">{b.time_slot}</td>
                  <td className="px-4 py-3 text-neutral-500 tabular-nums">{b.guest_count}</td>
                  <td className="px-4 py-3">
                    <StatusSelect value={b.status} bookingId={b.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
