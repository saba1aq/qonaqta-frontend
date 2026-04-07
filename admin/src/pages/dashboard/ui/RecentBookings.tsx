import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { cn } from "@/shared/lib/utils";

interface Booking {
  id: string;
  guest: string;
  phone: string;
  restaurant: string;
  table: string;
  date: string;
  time: string;
  guests: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
}

const statusConfig = {
  confirmed: { label: "Подтверждено", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  pending: { label: "Ожидание", className: "bg-amber-50 text-amber-700 border-amber-200" },
  cancelled: { label: "Отменено", className: "bg-red-50 text-red-600 border-red-200" },
  completed: { label: "Завершено", className: "bg-neutral-50 text-neutral-500 border-neutral-200" },
};

const mockBookings: Booking[] = [
  { id: "1", guest: "Алихан Сериков", phone: "+7 701 123 45 67", restaurant: "Maestro", table: "Стол 4", date: "Сегодня", time: "19:00", guests: 4, status: "confirmed" },
  { id: "2", guest: "Дана Кенжебаева", phone: "+7 707 987 65 43", restaurant: "Maestro", table: "Стол 12", date: "Сегодня", time: "20:30", guests: 2, status: "pending" },
  { id: "3", guest: "Тимур Абдулов", phone: "+7 702 555 33 22", restaurant: "Silk Way", table: "VIP 1", date: "Сегодня", time: "18:00", guests: 6, status: "completed" },
  { id: "4", guest: "Аяна Муратова", phone: "+7 700 111 22 33", restaurant: "Maestro", table: "Стол 7", date: "Завтра", time: "13:00", guests: 3, status: "confirmed" },
  { id: "5", guest: "Ержан Касымов", phone: "+7 705 444 55 66", restaurant: "Silk Way", table: "Стол 2", date: "Завтра", time: "19:30", guests: 2, status: "cancelled" },
];

export function RecentBookings() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
        <h3 className="text-[14px] font-medium text-neutral-900">Последние брони</h3>
        <button className="text-[13px] text-neutral-400 transition-colors hover:text-neutral-900">
          Все брони
        </button>
      </div>
      <div className="divide-y divide-neutral-100">
        {mockBookings.map((booking) => {
          const initials = booking.guest
            .split(" ")
            .map((n) => n[0])
            .join("");
          const config = statusConfig[booking.status];
          return (
            <div
              key={booking.id}
              className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-neutral-50"
            >
              <Avatar className="size-9 border border-neutral-200">
                <AvatarFallback className="bg-neutral-100 text-[11px] text-neutral-500">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[13px] font-medium text-neutral-900">
                    {booking.guest}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-md px-1.5 py-0 text-[10px] font-normal",
                      config.className
                    )}
                  >
                    {config.label}
                  </Badge>
                </div>
                <p className="mt-0.5 text-[12px] text-neutral-400">
                  {booking.restaurant} · {booking.table} · {booking.guests} гост.
                </p>
              </div>
              <div className="text-right">
                <p className="text-[13px] text-neutral-900">{booking.time}</p>
                <p className="text-[11px] text-neutral-400">{booking.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
