import { cn } from "@/shared/lib/utils";
import type { FloorObject } from "../model/types";
import { useFloorPlan } from "../model/use-floor-plan";
import { FloorPlanToolbar } from "./FloorPlanToolbar";
import { FloorPlanSidebar } from "./FloorPlanSidebar";

interface FloorPlanEditorProps {
  initialObjects: FloorObject[];
  onSave: (objects: FloorObject[]) => void;
}

export function FloorPlanEditor({ initialObjects, onSave }: FloorPlanEditorProps) {
  const {
    canvasRef,
    containerRef,
    isEditing,
    camera,
    activeTool,
    selectedObj,
    cursorClass,
    setActiveTool,
    startEditing,
    cancelEditing,
    saveEditing,
    deleteSelected,
    rotateSelected,
    updateSelectedObj,
    resetView,
    zoomIn,
    zoomOut,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
  } = useFloorPlan({ initialObjects, onSave });

  return (
    <div className="flex h-[calc(100svh-48px)] flex-col -m-6 lg:-m-8">
      <FloorPlanToolbar
        isEditing={isEditing}
        camera={camera}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetView={resetView}
        onStartEditing={startEditing}
        onCancelEditing={cancelEditing}
        onSaveEditing={saveEditing}
      />

      <div className="flex flex-1 overflow-hidden">
        <div
          ref={containerRef}
          className={cn("flex-1 overflow-hidden", cursorClass)}
        >
          <canvas
            ref={canvasRef}
            className="size-full"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          />
        </div>

        {isEditing && (
          <FloorPlanSidebar
            activeTool={activeTool}
            selectedObj={selectedObj}
            onSelectTool={setActiveTool}
            onUpdateObject={updateSelectedObj}
            onDeleteObject={deleteSelected}
            onRotateObject={rotateSelected}
          />
        )}
      </div>
    </div>
  );
}
