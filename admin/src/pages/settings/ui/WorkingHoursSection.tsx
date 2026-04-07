import { Clock } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import type { DayOfWeek, WorkingHoursData } from "../model/types";
import { DAY_LABELS, DAYS_ORDER } from "../model/constants";

interface WorkingHoursSectionProps {
  workingHours: WorkingHoursData;
  onChange: (data: WorkingHoursData) => void;
}

export function WorkingHoursSection({ workingHours, onChange }: WorkingHoursSectionProps) {
  const toggleSameForAll = () => {
    onChange({ ...workingHours, sameForAll: !workingHours.sameForAll });
  };

  const updateAllDays = (field: "open" | "close", value: string) => {
    onChange({
      ...workingHours,
      allDays: { ...workingHours.allDays, [field]: value },
    });
  };

  const updateDay = (day: DayOfWeek, field: "open" | "close" | "enabled", value: string | boolean) => {
    onChange({
      ...workingHours,
      days: {
        ...workingHours.days,
        [day]: { ...workingHours.days[day], [field]: value },
      },
    });
  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-medium text-neutral-900">Режим работы</h2>
        <label className="flex items-center gap-2 text-xs text-neutral-500">
          Одинаково для всех дней
          <Switch checked={workingHours.sameForAll} onCheckedChange={toggleSameForAll} />
        </label>
      </div>

      <div className="mt-4 space-y-3">
        {workingHours.sameForAll ? (
          <div className="flex items-center gap-3">
            <Label className="flex shrink-0 items-center gap-1.5 text-xs text-neutral-500">
              <Clock className="size-3.5" />
              Ежедневно
            </Label>
            <div className="flex flex-1 items-center gap-2">
              <Input
                type="time"
                value={workingHours.allDays.open}
                onChange={(e) => updateAllDays("open", e.target.value)}
                className="w-auto"
              />
              <span className="text-xs text-neutral-400">—</span>
              <Input
                type="time"
                value={workingHours.allDays.close}
                onChange={(e) => updateAllDays("close", e.target.value)}
                className="w-auto"
              />
            </div>
          </div>
        ) : (
          DAYS_ORDER.map((day) => {
            const schedule = workingHours.days[day];
            return (
              <div key={day} className="flex items-center gap-3">
                <div className="flex w-28 shrink-0 items-center gap-2">
                  <Switch
                    checked={schedule.enabled}
                    onCheckedChange={(v) => updateDay(day, "enabled", v)}
                  />
                  <span
                    className={cn(
                      "text-xs",
                      schedule.enabled ? "text-neutral-700" : "text-neutral-400",
                    )}
                  >
                    {DAY_LABELS[day]}
                  </span>
                </div>
                {schedule.enabled ? (
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      type="time"
                      value={schedule.open}
                      onChange={(e) => updateDay(day, "open", e.target.value)}
                      className="w-auto"
                    />
                    <span className="text-xs text-neutral-400">—</span>
                    <Input
                      type="time"
                      value={schedule.close}
                      onChange={(e) => updateDay(day, "close", e.target.value)}
                      className="w-auto"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-neutral-400">Выходной</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
