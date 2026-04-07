import { ZoomIn, ZoomOut, Maximize, Pencil, Save, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import type { Camera } from "../model/types";

interface FloorPlanToolbarProps {
  isEditing: boolean;
  camera: Camera;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onSaveEditing: () => void;
}

export function FloorPlanToolbar({
  isEditing,
  camera,
  onZoomIn,
  onZoomOut,
  onResetView,
  onStartEditing,
  onCancelEditing,
  onSaveEditing,
}: FloorPlanToolbarProps) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-neutral-900">Схема зала</h2>
        {isEditing && (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-700">
            Редактирование
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={onZoomOut} title="Уменьшить">
          <ZoomOut className="size-4" />
        </Button>
        <span className="min-w-12 text-center text-xs text-neutral-500">
          {Math.round(camera.zoom * 100)}%
        </span>
        <Button variant="ghost" size="sm" onClick={onZoomIn} title="Увеличить">
          <ZoomIn className="size-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onResetView} title="Сбросить вид">
          <Maximize className="size-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {!isEditing ? (
          <Button size="sm" onClick={onStartEditing}>
            <Pencil className="size-4" />
            <span className="ml-1.5">Редактировать</span>
          </Button>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={onCancelEditing}>
              <X className="size-4" />
              <span className="ml-1.5">Отмена</span>
            </Button>
            <Button size="sm" onClick={onSaveEditing}>
              <Save className="size-4" />
              <span className="ml-1.5">Сохранить</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
