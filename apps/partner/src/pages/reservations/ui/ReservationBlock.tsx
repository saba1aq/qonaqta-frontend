import { cn } from "@qonaqta/ui/lib/utils";
import type { Reservation } from "../model/types";
import { HOUR_WIDTH, STATUS_STYLES, TIMELINE_START } from "../model/constants";

interface ReservationBlockProps {
  reservation: Reservation;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
}

function timeToHours(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

export function ReservationBlock({ reservation, isSelected, onClick }: ReservationBlockProps) {
  const start = timeToHours(reservation.startTime);
  const end = timeToHours(reservation.endTime);
  const left = (start - TIMELINE_START) * HOUR_WIDTH;
  const width = (end - start) * HOUR_WIDTH;
  const style = STATUS_STYLES[reservation.status];
  const isWide = width >= HOUR_WIDTH * 2;

  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute top-1.5 flex items-center gap-1.5 rounded-lg px-2.5 text-xs transition-shadow",
        style.bg,
        style.border,
        style.text,
        isSelected && "ring-2 ring-[#EEC0FF] shadow-[0_2px_12px_rgba(0,0,0,0.1)]",
        reservation.status === "blocked" && "justify-center",
      )}
      style={{
        left: `${left}px`,
        width: `${width - 4}px`,
        height: "36px",
        ...(reservation.status === "blocked"
          ? { background: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(28,28,28,0.04) 4px, rgba(28,28,28,0.04) 8px)" }
          : {}),
      }}
    >
      {reservation.status === "blocked" ? (
        <span className="text-[11px] text-[#1C1C1C]/20">Заблокировано</span>
      ) : (
        <>
          <span className="truncate">
            {reservation.guestName} · {reservation.partySize}
          </span>
          {isWide && reservation.status !== "completed" && (
            <span className="shrink-0 text-[11px] opacity-50">
              {reservation.startTime}–{reservation.endTime}
            </span>
          )}
          {reservation.status === "seated" && reservation.seatedMinutes != null && (
            <span className="ml-auto shrink-0 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
              {reservation.seatedMinutes} мин
            </span>
          )}
          {reservation.status === "no-show" && (
            <span className="ml-auto shrink-0 rounded bg-red-400/10 px-1 py-0.5 text-[10px] text-red-400/60">
              no-show
            </span>
          )}
        </>
      )}
    </button>
  );
}
