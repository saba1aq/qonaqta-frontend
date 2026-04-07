import { useRef, useState, useMemo } from "react"
import { cn } from "@qonaqta/ui/lib/utils"
import type { Reservation } from "../model/types"
import {
  HOUR_WIDTH,
  ROW_HEIGHT,
  TABLE_COL_WIDTH,
  TABLES,
  TIMELINE_END,
  TIMELINE_START,
  ZONES,
  ZONE_COLORS,
  STATUS_STYLES,
} from "../model/constants"
import { ReservationBlock } from "./ReservationBlock"
import { ReservationDetailCard } from "./ReservationDetailCard"

interface TimelineViewProps {
  reservations: Reservation[]
  currentTime: string
  onConfirm: (id: string) => void
  onCancel: (id: string) => void
  onNoShow: (id: string) => void
  onComplete: (id: string) => void
}

function timeToHours(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return h + m / 60
}

const hours = Array.from({ length: TIMELINE_END - TIMELINE_START }, (_, i) => TIMELINE_START + i)

export function TimelineView({ reservations, currentTime, onConfirm, onCancel, onNoShow, onComplete }: TimelineViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detailPos, setDetailPos] = useState<{ top: number; left: number } | null>(null)

  const timelineWidth = (TIMELINE_END - TIMELINE_START) * HOUR_WIDTH
  const currentHours = timeToHours(currentTime)
  const currentX = (currentHours - TIMELINE_START) * HOUR_WIDTH

  const tablesByZone = useMemo(() => {
    return ZONES.map((zone) => ({
      zone,
      tables: TABLES.filter((t) => t.zone === zone.id),
    }))
  }, [])

  const allRows: ({ type: "zone"; zone: (typeof ZONES)[0] } | { type: "table"; table: (typeof TABLES)[0]; rowIndex: number })[] = []
  let rowIndex = 0
  for (const { zone, tables } of tablesByZone) {
    allRows.push({ type: "zone", zone })
    for (const table of tables) {
      allRows.push({ type: "table", table, rowIndex })
      rowIndex++
    }
  }

  const handleBlockClick = (reservation: Reservation, e: React.MouseEvent) => {
    if (selectedId === reservation.id) {
      setSelectedId(null)
      setDetailPos(null)
      return
    }
    setSelectedId(reservation.id)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const scrollEl = scrollRef.current
    if (!scrollEl) return
    const containerRect = scrollEl.getBoundingClientRect()
    setDetailPos({
      top: rect.bottom - containerRect.top + scrollEl.scrollTop + 6,
      left: rect.left - containerRect.left + scrollEl.scrollLeft,
    })
  }

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const r of reservations) {
      counts[r.status] = (counts[r.status] || 0) + 1
    }
    return counts
  }, [reservations])

  const totalCovers = useMemo(
    () => reservations.filter((r) => r.status !== "blocked").reduce((sum, r) => sum + r.partySize, 0),
    [reservations]
  )

  return (
    <div className="flex flex-col rounded-2xl bg-[#FEFEFE] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-1 overflow-hidden">
        <div className="shrink-0" style={{ width: TABLE_COL_WIDTH }}>
          <div className="flex h-10 items-center border-b border-[#F3F3F3] px-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.5px] text-[#1C1C1C]/40">
              Столы
            </span>
          </div>
          <div>
            {allRows.map((row) => {
              if (row.type === "zone") {
                return (
                  <div
                    key={`zone-${row.zone.id}`}
                    className="flex h-7 items-center border-b border-[#F3F3F3] bg-[#F3F3F3]/50 px-4"
                  >
                    <span className="text-[11px] font-medium uppercase tracking-[0.5px] text-[#1C1C1C]/30">
                      {row.zone.name}
                    </span>
                  </div>
                )
              }
              return (
                <div
                  key={row.table.id}
                  className={cn(
                    "flex items-center gap-2.5 border-b border-[#F3F3F3] px-4",
                    row.rowIndex % 2 === 1 && "bg-[#F3F3F3]/50"
                  )}
                  style={{ height: ROW_HEIGHT }}
                >
                  <div
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center text-[#1C1C1C]/30",
                      row.table.shape === "circle"
                        ? "rounded-full border border-[#1C1C1C]/20"
                        : "rounded-[3px] border border-[#1C1C1C]/20"
                    )}
                  >
                    <span className="text-[8px]">{row.table.capacity}</span>
                  </div>
                  <span className="text-[13px] font-medium text-[#1C1C1C]">{row.table.name}</span>
                  <span className="text-[11px] text-[#1C1C1C]/40">{row.table.capacity} мест</span>
                  <div className={cn("ml-auto size-2 rounded-full", ZONE_COLORS[row.table.zone])} />
                </div>
              )
            })}
          </div>
        </div>

        <div ref={scrollRef} className="relative flex-1 overflow-x-auto overflow-y-hidden border-l border-[#F3F3F3]">
          <div style={{ width: timelineWidth, position: "relative" }}>
            <div className="flex h-10 border-b border-[#F3F3F3]">
              {hours.map((h) => (
                <div
                  key={h}
                  className="shrink-0 border-r border-[#1C1C1C]/5"
                  style={{ width: HOUR_WIDTH }}
                >
                  <span className="pl-2 text-[11px] text-[#1C1C1C]/30">
                    {String(h).padStart(2, "0")}:00
                  </span>
                </div>
              ))}
            </div>

            <div className="relative">
              {allRows.map((row) => {
                if (row.type === "zone") {
                  return (
                    <div
                      key={`zone-row-${row.zone.id}`}
                      className="h-7 border-b border-[#F3F3F3] bg-[#F3F3F3]/50"
                    />
                  )
                }
                return (
                  <div
                    key={`table-row-${row.table.id}`}
                    className={cn(
                      "relative border-b border-[#F3F3F3]",
                      row.rowIndex % 2 === 1 && "bg-[#F3F3F3]/50"
                    )}
                    style={{ height: ROW_HEIGHT }}
                  >
                    {hours.map((h) => (
                      <div
                        key={h}
                        className="absolute top-0 h-full border-r border-[#1C1C1C]/5"
                        style={{ left: (h - TIMELINE_START) * HOUR_WIDTH, width: HOUR_WIDTH }}
                      />
                    ))}
                    {reservations
                      .filter((r) => r.tableId === row.table.id)
                      .map((r) => (
                        <ReservationBlock
                          key={r.id}
                          reservation={r}
                          isSelected={selectedId === r.id}
                          onClick={(e) => handleBlockClick(r, e)}
                        />
                      ))}
                  </div>
                )
              })}

              {currentHours >= TIMELINE_START && currentHours <= TIMELINE_END && (
                <div
                  className="absolute top-0 z-30 h-full w-[1.5px] bg-[#EEC0FF]"
                  style={{ left: currentX }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                    <div className="mx-auto size-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-[#EEC0FF]" />
                    <div className="rounded-full bg-[#EEC0FF] px-1.5 py-0.5 text-[10px] font-medium text-white">
                      {currentTime}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedId && detailPos && (
              <ReservationDetailCard
                reservation={reservations.find((r) => r.id === selectedId)!}
                position={detailPos}
                onClose={() => {
                  setSelectedId(null)
                  setDetailPos(null)
                }}
                onConfirm={onConfirm}
                onCancel={onCancel}
                onNoShow={onNoShow}
                onComplete={onComplete}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#F3F3F3] px-5 py-3">
        <div className="flex items-center gap-4">
          {(["confirmed", "seated", "pending", "completed", "no-show"] as const).map((status) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className={cn("size-2 rounded-full", STATUS_STYLES[status].dot)} />
              <span className="text-xs text-[#1C1C1C]/50">
                {STATUS_STYLES[status].label} · {statusCounts[status] || 0}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[13px] font-medium text-[#1C1C1C]">
            Гостей сегодня: {totalCovers}
          </span>
        </div>
      </div>
    </div>
  )
}
