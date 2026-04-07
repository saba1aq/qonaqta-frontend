import { Circle, RotateCw, Square, Trash2 } from "lucide-react";
import { cn } from "@qonaqta/ui/lib/utils";
import { Separator } from "@qonaqta/ui/components/separator";
import type { FloorObject, Tool } from "../model/types";
import { OBJECT_STYLES, PALETTE_ITEMS } from "../model/constants";

interface FloorPlanSidebarProps {
  activeTool: Tool;
  selectedObj: FloorObject | undefined;
  onSelectTool: (tool: Tool) => void;
  onUpdateObject: (updates: Partial<FloorObject>) => void;
  onDeleteObject: () => void;
  onRotateObject: () => void;
}

export function FloorPlanSidebar({
  activeTool,
  selectedObj,
  onSelectTool,
  onUpdateObject,
  onDeleteObject,
  onRotateObject,
}: FloorPlanSidebarProps) {
  return (
    <div className="w-64 shrink-0 overflow-y-auto border-l border-neutral-200 bg-white">
      <div className="p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Компоненты
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {PALETTE_ITEMS.map(({ tool, icon: Icon, label, type }) => {
            const style = OBJECT_STYLES[type];
            return (
              <button
                key={tool}
                onClick={() => onSelectTool(tool)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-[11px] transition-colors",
                  activeTool === tool
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-neutral-200 text-neutral-600 hover:bg-neutral-50",
                )}
              >
                <div
                  className="flex size-9 items-center justify-center rounded-md border"
                  style={{ backgroundColor: style.fill, borderColor: style.stroke }}
                >
                  <Icon className="size-4" />
                </div>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {selectedObj && (
        <>
          <Separator />
          <div className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Свойства
              </h3>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={onRotateObject}
                  className="rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                  title="Повернуть (R)"
                >
                  <RotateCw className="size-3.5" />
                </button>
                <button
                  onClick={onDeleteObject}
                  className="rounded-md p-1 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  title="Удалить"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-neutral-500">Название</label>
                <input
                  type="text"
                  value={selectedObj.label}
                  onChange={(e) => onUpdateObject({ label: e.target.value })}
                  className="w-full rounded-md border border-neutral-200 px-2.5 py-1.5 text-sm outline-none focus:border-neutral-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-500">Поворот</label>
                <span className="text-sm text-neutral-700">{selectedObj.rotation}°</span>
              </div>
              {selectedObj.type === "table" && (
                <div>
                  <label className="mb-1 block text-xs text-neutral-500">Кол-во мест</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={selectedObj.seats}
                    onChange={(e) => onUpdateObject({ seats: parseInt(e.target.value) || 1 })}
                    className="w-full rounded-md border border-neutral-200 px-2.5 py-1.5 text-sm outline-none focus:border-neutral-400"
                  />
                </div>
              )}
              {selectedObj.type === "table" && (
                <div>
                  <label className="mb-1 block text-xs text-neutral-500">Форма</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onUpdateObject({ shape: "rect" })}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-1.5 rounded-md border py-1.5 text-xs transition-colors",
                        selectedObj.shape === "rect"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 text-neutral-600 hover:bg-neutral-50",
                      )}
                    >
                      <Square className="size-3.5" />
                      Прямоуг.
                    </button>
                    <button
                      onClick={() => onUpdateObject({ shape: "circle" })}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-1.5 rounded-md border py-1.5 text-xs transition-colors",
                        selectedObj.shape === "circle"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 text-neutral-600 hover:bg-neutral-50",
                      )}
                    >
                      <Circle className="size-3.5" />
                      Круглый
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
