import { type LucideIcon } from "lucide-react";
import { cn } from "@qonaqta/ui/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="group rounded-2xl border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-[13px] text-neutral-500">{title}</p>
          <p className="text-2xl font-semibold tracking-[-0.02em] text-neutral-900">
            {value}
          </p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 transition-colors group-hover:bg-neutral-100 group-hover:text-neutral-500">
          <Icon className="size-5" />
        </div>
      </div>
      {change && (
        <p className="mt-3 text-[12px]">
          <span
            className={cn(
              "font-medium",
              changeType === "positive" && "text-emerald-600",
              changeType === "negative" && "text-red-500",
              changeType === "neutral" && "text-neutral-400"
            )}
          >
            {change}
          </span>
          <span className="ml-1 text-neutral-400">vs прошлая неделя</span>
        </p>
      )}
    </div>
  );
}
