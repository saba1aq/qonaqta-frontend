import { useRef, useEffect, useState, useCallback } from "react";
import type { Camera, FloorObject, ResizeHandle, Tool } from "./types";
import { HANDLE_CURSORS, MAX_ZOOM, MIN_OBJ_SIZE, MIN_ZOOM, OBJECT_DEFAULTS, TOOL_TYPE_MAP } from "./constants";
import { drawFloorObject, drawGrid } from "../lib/canvas";
import { hitTest, hitTestHandle } from "../lib/hit-test";
import { generateId, snapToGrid } from "../lib/utils";

interface UseFloorPlanParams {
  initialObjects: FloorObject[];
  onSave: (objects: FloorObject[]) => void;
}

export function useFloorPlan({ initialObjects, onSave }: UseFloorPlanParams) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [objects, setObjects] = useState<FloorObject[]>(initialObjects);
  const [savedSnapshot, setSavedSnapshot] = useState<FloorObject[]>(initialObjects);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, zoom: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const [hoveredHandle, setHoveredHandle] = useState<ResizeHandle | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragObjStart = useRef({ x: 0, y: 0 });
  const resizeObjStart = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const counters = useRef<Record<string, number>>({ table: 1, toilet: 1, bar: 1, wall: 1 });

  useEffect(() => {
    setObjects(initialObjects);
    setSavedSnapshot(initialObjects);
  }, [initialObjects]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, rect.width, rect.height);

    drawGrid(ctx, camera, rect.width, rect.height);
    objects.forEach((obj) => {
      drawFloorObject(ctx, obj, camera, obj.id === selectedId, isEditing);
    });
  }, [objects, camera, selectedId, isEditing]);

  useEffect(() => {
    const id = requestAnimationFrame(render);
    return () => cancelAnimationFrame(id);
  }, [render]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => render());
    observer.observe(container);
    return () => observer.disconnect();
  }, [render]);

  const getCanvasPoint = (e: React.MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const point = getCanvasPoint(e);

    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      dragStart.current = { x: point.x, y: point.y };
      return;
    }

    if (!isEditing) {
      if (e.button === 0 && !e.altKey) {
        setIsPanning(true);
        dragStart.current = { x: point.x, y: point.y };
      }
      return;
    }

    if (activeTool !== "select") {
      const wx = snapToGrid(point.x / camera.zoom - camera.x);
      const wy = snapToGrid(point.y / camera.zoom - camera.y);
      const objType = TOOL_TYPE_MAP[activeTool];
      const defaults = OBJECT_DEFAULTS[objType];
      const shape = activeTool === "add-circle" ? ("circle" as const) : defaults.shape;
      const newObj: FloorObject = {
        id: generateId(),
        x: wx - defaults.width / 2,
        y: wy - defaults.height / 2,
        width: defaults.width,
        height: defaults.height,
        rotation: 0,
        shape,
        type: objType,
        seats: defaults.seats,
        label: `${defaults.prefix} ${counters.current[objType]++}`,
      };
      setObjects((prev) => [...prev, newObj]);
      setSelectedId(newObj.id);
      setActiveTool("select");
      return;
    }

    if (selectedId) {
      const selObj = objects.find((o) => o.id === selectedId);
      if (selObj) {
        const handle = hitTestHandle(point.x, point.y, selObj, camera);
        if (handle) {
          setResizeHandle(handle);
          dragStart.current = { x: point.x, y: point.y };
          resizeObjStart.current = { x: selObj.x, y: selObj.y, w: selObj.width, h: selObj.height };
          return;
        }
      }
    }

    const hit = [...objects].reverse().find((t) => hitTest(point.x, point.y, t, camera));
    if (hit) {
      setSelectedId(hit.id);
      setIsDragging(true);
      dragStart.current = { x: point.x, y: point.y };
      dragObjStart.current = { x: hit.x, y: hit.y };
    } else {
      setSelectedId(null);
      setIsPanning(true);
      dragStart.current = { x: point.x, y: point.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const point = getCanvasPoint(e);

    if (isPanning) {
      const dx = (point.x - dragStart.current.x) / camera.zoom;
      const dy = (point.y - dragStart.current.y) / camera.zoom;
      setCamera((c) => ({ ...c, x: c.x + dx, y: c.y + dy }));
      dragStart.current = { x: point.x, y: point.y };
      return;
    }

    if (resizeHandle && selectedId) {
      const dx = (point.x - dragStart.current.x) / camera.zoom;
      const dy = (point.y - dragStart.current.y) / camera.zoom;
      const s = resizeObjStart.current;
      let nx = s.x,
        ny = s.y,
        nw = s.w,
        nh = s.h;

      if (resizeHandle.includes("e")) nw = Math.max(MIN_OBJ_SIZE, snapToGrid(s.w + dx));
      if (resizeHandle.includes("w")) {
        const newW = Math.max(MIN_OBJ_SIZE, snapToGrid(s.w - dx));
        nx = snapToGrid(s.x + (s.w - newW));
        nw = newW;
      }
      if (resizeHandle.includes("s")) nh = Math.max(MIN_OBJ_SIZE, snapToGrid(s.h + dy));
      if (resizeHandle.includes("n")) {
        const newH = Math.max(MIN_OBJ_SIZE, snapToGrid(s.h - dy));
        ny = snapToGrid(s.y + (s.h - newH));
        nh = newH;
      }

      setObjects((prev) =>
        prev.map((t) => (t.id === selectedId ? { ...t, x: nx, y: ny, width: nw, height: nh } : t)),
      );
      return;
    }

    if (isDragging && selectedId) {
      const dx = (point.x - dragStart.current.x) / camera.zoom;
      const dy = (point.y - dragStart.current.y) / camera.zoom;
      setObjects((prev) =>
        prev.map((t) =>
          t.id === selectedId
            ? {
                ...t,
                x: snapToGrid(dragObjStart.current.x + dx),
                y: snapToGrid(dragObjStart.current.y + dy),
              }
            : t,
        ),
      );
      return;
    }

    if (isEditing && activeTool === "select" && selectedId) {
      const selObj = objects.find((o) => o.id === selectedId);
      setHoveredHandle(selObj ? hitTestHandle(point.x, point.y, selObj, camera) : null);
    } else {
      setHoveredHandle(null);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setIsDragging(false);
    setResizeHandle(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const point = getCanvasPoint(e);
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setCamera((c) => {
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, c.zoom * delta));
      const wx = point.x / c.zoom - c.x;
      const wy = point.y / c.zoom - c.y;
      return { zoom: newZoom, x: point.x / newZoom - wx, y: point.y / newZoom - wy };
    });
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setObjects((prev) => prev.filter((t) => t.id !== selectedId));
    setSelectedId(null);
  };

  const rotateSelected = () => {
    if (!selectedId) return;
    setObjects((prev) =>
      prev.map((t) => (t.id === selectedId ? { ...t, rotation: (t.rotation + 90) % 360 } : t)),
    );
  };

  const resetView = () => setCamera({ x: 0, y: 0, zoom: 1 });
  const zoomIn = () => setCamera((c) => ({ ...c, zoom: Math.min(MAX_ZOOM, c.zoom * 1.2) }));
  const zoomOut = () => setCamera((c) => ({ ...c, zoom: Math.max(MIN_ZOOM, c.zoom / 1.2) }));

  const startEditing = () => {
    setSavedSnapshot([...objects]);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setObjects(savedSnapshot);
    setSelectedId(null);
    setActiveTool("select");
    setIsEditing(false);
  };

  const saveEditing = () => {
    onSave(objects);
    setSavedSnapshot([...objects]);
    setSelectedId(null);
    setActiveTool("select");
    setIsEditing(false);
  };

  const selectedObj = objects.find((t) => t.id === selectedId);

  const updateSelectedObj = (updates: Partial<FloorObject>) => {
    if (!selectedId) return;
    setObjects((prev) => prev.map((t) => (t.id === selectedId ? { ...t, ...updates } : t)));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditing) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        deleteSelected();
      }
      if (e.key === "r" || e.key === "R") {
        rotateSelected();
      }
      if (e.key === "Escape") {
        setSelectedId(null);
        setActiveTool("select");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const cursorClass = (() => {
    if (resizeHandle) return HANDLE_CURSORS[resizeHandle];
    if (isPanning) return "cursor-grabbing";
    if (hoveredHandle) return HANDLE_CURSORS[hoveredHandle];
    if (!isEditing) return "cursor-grab";
    if (activeTool !== "select") return "cursor-crosshair";
    return "cursor-default";
  })();

  return {
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
  };
}
