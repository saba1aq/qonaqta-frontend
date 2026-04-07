import { Clock, Phone, Users, CreditCard, MessageSquare } from "lucide-react"
import { Button } from "@qonaqta/ui/components/button"
import { Separator } from "@qonaqta/ui/components/separator"
import type { Reservation } from "../model/types"
import { TABLES } from "../model/constants"

interface ReservationDetailCardProps {
  reservation: Reservation
  position: { top: number; left: number }
  onClose: () => void
  onConfirm: (id: string) => void
  onCancel: (id: string) => void
  onNoShow: (id: string) => void
  onComplete: (id: string) => void
}

export function ReservationDetailCard({
  reservation,
  position,
  onClose,
  onConfirm,
  onCancel,
  onNoShow,
  onComplete,
}: ReservationDetailCardProps) {
  const table = TABLES.find((t) => t.id === reservation.tableId)
  const zone = table?.zone === "main" ? "Основной зал" : table?.zone === "terrace" ? "Терраса" : "VIP"

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="absolute z-50 w-60 rounded-xl bg-[#FEFEFE] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.10)]"
        style={{ top: position.top, left: position.left }}
      >
        <p className="text-[15px] font-medium text-[#1C1C1C]">
          {reservation.guestName}
        </p>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#1C1C1C]/60">
            <Phone className="size-3.5 shrink-0" />
            {reservation.guestPhone}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#1C1C1C]/60">
            <Users className="size-3.5 shrink-0" />
            {reservation.partySize} гостей
          </div>
          <div className="flex items-center gap-2 text-xs text-[#1C1C1C]/60">
            <Clock className="size-3.5 shrink-0" />
            {reservation.startTime} — {reservation.endTime}
          </div>
          {table && (
            <div className="flex items-center gap-2 text-xs text-[#1C1C1C]/60">
              <div className="size-3.5 shrink-0" />
              {table.name} · {zone}
            </div>
          )}
          {reservation.deposit != null && (
            <div className="flex items-center gap-2 text-xs">
              <CreditCard className="size-3.5 shrink-0 text-[#1C1C1C]/60" />
              <span className={reservation.depositPaid ? "text-green-600" : "text-[#1C1C1C]/60"}>
                {reservation.deposit.toLocaleString()} ₸ {reservation.depositPaid ? "оплачен" : "не оплачен"}
              </span>
              {reservation.depositPaid && <span className="text-green-600">✓</span>}
            </div>
          )}
          {reservation.note && (
            <div className="flex items-start gap-2 text-xs">
              <MessageSquare className="mt-0.5 size-3.5 shrink-0 text-[#1C1C1C]/60" />
              <span className="rounded-md bg-[#F9E7FF] px-2 py-1 text-[#1C1C1C]/70">
                {reservation.note}
              </span>
            </div>
          )}
        </div>

        <Separator className="my-3" />

        <div className="flex flex-wrap items-center gap-1.5">
          {reservation.status === "pending" && (
            <Button
              size="xs"
              className="rounded-full bg-[#232323] text-[11px] text-white"
              onClick={() => { onConfirm(reservation.id); onClose() }}
            >
              Подтвердить
            </Button>
          )}
          {reservation.status === "confirmed" && (
            <Button
              size="xs"
              className="rounded-full bg-[#232323] text-[11px] text-white"
              onClick={() => { onComplete(reservation.id); onClose() }}
            >
              Завершить
            </Button>
          )}
          {(reservation.status === "confirmed" || reservation.status === "pending") && (
            <Button
              size="xs"
              variant="outline"
              className="rounded-full text-[11px]"
              onClick={() => { onNoShow(reservation.id); onClose() }}
            >
              Не пришёл
            </Button>
          )}
          {(reservation.status === "confirmed" || reservation.status === "pending") && (
            <button
              className="ml-auto text-[11px] text-red-400/70 transition-colors hover:text-red-500"
              onClick={() => { onCancel(reservation.id); onClose() }}
            >
              Отменить
            </button>
          )}
        </div>
      </div>
    </>
  )
}
