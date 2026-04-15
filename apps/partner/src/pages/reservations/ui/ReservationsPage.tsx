import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, SlidersHorizontal } from "lucide-react"
import { cn } from "@qonaqta/ui/lib/utils"
import { Button } from "@qonaqta/ui/components/button"
import type { Reservation } from "../model/types"
import { formatDate } from "../lib/date-utils"
import { mapApiBooking } from "../lib/mappers"
import { useAdminContext, useBookings, useBookingActions } from "../api"
import { TimelineView } from "./TimelineView"

export function ReservationsPage() {
  const [date, setDate] = useState(() => new Date())
  const [view, setView] = useState<"timeline" | "list">("timeline")

  const isToday = new Date().toDateString() === date.toDateString()

  const prevDay = () => setDate((d) => new Date(d.getTime() - 86400000))
  const nextDay = () => setDate((d) => new Date(d.getTime() + 86400000))
  const goToday = () => setDate(new Date())

  const now = new Date()
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

  const { data: context } = useAdminContext()
  const branchId = context?.branchId

  const { data: apiBookings = [], isLoading } = useBookings(branchId, date)

  const reservations: Reservation[] = apiBookings.map(mapApiBooking)

  const { confirmMutation, cancelMutation, noShowMutation, completeMutation } = useBookingActions()

  const todayCount = reservations.length

  return (
    <div className="flex h-[calc(100svh-48px)] flex-col gap-5 -m-6 lg:-m-8 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl font-semibold text-[#1C1C1C]">Брони</h1>
          <span className="text-sm text-[#1C1C1C]/40">{todayCount} сегодня</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={prevDay}
              className="flex size-8 items-center justify-center rounded-lg text-[#1C1C1C]/50 transition-colors hover:bg-[#F3F3F3]"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="min-w-[240px] text-center text-[15px] font-medium text-[#1C1C1C]">
              {formatDate(date)}
            </span>
            <button
              onClick={nextDay}
              className="flex size-8 items-center justify-center rounded-lg text-[#1C1C1C]/50 transition-colors hover:bg-[#F3F3F3]"
            >
              <ChevronRight className="size-4" />
            </button>
            {!isToday && (
              <button
                onClick={goToday}
                className="ml-1 rounded-lg bg-[#F3F3F3] px-2.5 py-1 text-[13px] text-[#1C1C1C] transition-colors hover:bg-[#E8E8E8]"
              >
                Сегодня
              </button>
            )}
          </div>

          <div className="flex rounded-[10px] border border-[#F3F3F3] bg-[#FEFEFE] p-0.5">
            <button
              onClick={() => setView("timeline")}
              className={cn(
                "rounded-lg px-3 py-1 text-[13px] font-medium transition-colors",
                view === "timeline" ? "bg-[#232323] text-white" : "text-[#1C1C1C]/50 hover:text-[#1C1C1C]"
              )}
            >
              Таймлайн
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "rounded-lg px-3 py-1 text-[13px] font-medium transition-colors",
                view === "list" ? "bg-[#232323] text-white" : "text-[#1C1C1C]/50 hover:text-[#1C1C1C]"
              )}
            >
              Список
            </button>
          </div>

          <Button variant="outline" size="sm" className="gap-1.5 rounded-xl text-[13px]">
            <SlidersHorizontal className="size-3.5" />
            Все статусы
          </Button>

          <Button size="sm" className="gap-1.5 rounded-xl bg-[#232323] text-[13px]">
            <Plus className="size-4" />
            Новая бронь
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {isLoading ? (
          <div className="flex h-full items-center justify-center rounded-2xl bg-[#FEFEFE] text-[#1C1C1C]/30">
            Загрузка...
          </div>
        ) : view === "timeline" ? (
          <TimelineView
            reservations={reservations}
            currentTime={currentTime}
            onConfirm={(id) => confirmMutation.mutate(id)}
            onCancel={(id) => cancelMutation.mutate(id)}
            onNoShow={(id) => noShowMutation.mutate(id)}
            onComplete={(id) => completeMutation.mutate(id)}
          />
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl bg-[#FEFEFE] text-[#1C1C1C]/30">
            Список — в разработке
          </div>
        )}
      </div>
    </div>
  )
}
