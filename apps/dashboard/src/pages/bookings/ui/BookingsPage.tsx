import { CalendarCheck } from "lucide-react"

export function BookingsPage() {
  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Брони</h1>
        <p className="mt-0.5 text-sm text-neutral-400">Все бронирования на платформе</p>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white py-20">
        <CalendarCheck className="size-10 text-neutral-200" />
        <p className="mt-3 text-sm text-neutral-400">Нет бронирований</p>
      </div>
    </div>
  )
}
