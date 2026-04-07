import {
  CalendarCheck,
  Users,
  UtensilsCrossed,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "./StatCard";
import { RecentBookings } from "./RecentBookings";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-[-0.02em] text-neutral-900">
          Дашборд
        </h1>
        <p className="mt-1 text-[13px] text-neutral-400">
          Обзор бронирований и статистики
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Брони сегодня"
          value="24"
          change="+12%"
          changeType="positive"
          icon={CalendarCheck}
        />
        <StatCard
          title="Гостей сегодня"
          value="86"
          change="+8%"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Рестораны"
          value="3"
          change="0"
          changeType="neutral"
          icon={UtensilsCrossed}
        />
        <StatCard
          title="Конверсия"
          value="73%"
          change="-2%"
          changeType="negative"
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentBookings />
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h3 className="text-[14px] font-medium text-neutral-900">
              Популярное время
            </h3>
            <div className="mt-4 space-y-3">
              {[
                { time: "19:00 – 20:00", pct: 85 },
                { time: "20:00 – 21:00", pct: 72 },
                { time: "18:00 – 19:00", pct: 58 },
                { time: "13:00 – 14:00", pct: 45 },
                { time: "21:00 – 22:00", pct: 30 },
              ].map((slot) => (
                <div key={slot.time}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-neutral-500">{slot.time}</span>
                    <span className="text-neutral-400">{slot.pct}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-neutral-900 transition-all"
                      style={{ width: `${slot.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h3 className="text-[14px] font-medium text-neutral-900">
              Быстрые действия
            </h3>
            <div className="mt-4 space-y-2">
              {[
                { label: "Создать бронь", icon: CalendarCheck },
              ].map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
