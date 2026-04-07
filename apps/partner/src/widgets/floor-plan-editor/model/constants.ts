import { Bath, Circle, Minus, Square, Wine } from "lucide-react";
import type { ObjectType, ResizeHandle, Tool } from "./types";

export const MIN_ZOOM = 0.2;
export const MAX_ZOOM = 3;
export const GRID_SIZE = 20;
export const HANDLE_SIZE = 8;
export const MIN_OBJ_SIZE = 40;

export const OBJECT_DEFAULTS: Record<
  ObjectType,
  { width: number; height: number; shape: "rect" | "circle"; seats: number; prefix: string }
> = {
  table: { width: 80, height: 80, shape: "rect", seats: 4, prefix: "Стол" },
  toilet: { width: 60, height: 60, shape: "rect", seats: 0, prefix: "WC" },
  bar: { width: 160, height: 60, shape: "rect", seats: 0, prefix: "Бар" },
  wall: { width: 200, height: 20, shape: "rect", seats: 0, prefix: "Стена" },
};

export const OBJECT_STYLES: Record<
  ObjectType,
  { fill: string; fillSelected: string; stroke: string; strokeSelected: string; shadow: string }
> = {
  table: { fill: "#f5f5f5", fillSelected: "#dbeafe", stroke: "#a3a3a3", strokeSelected: "#3b82f6", shadow: "rgba(59, 130, 246, 0.5)" },
  toilet: { fill: "#f0fdf4", fillSelected: "#dcfce7", stroke: "#86efac", strokeSelected: "#22c55e", shadow: "rgba(34, 197, 94, 0.5)" },
  bar: { fill: "#fefce8", fillSelected: "#fef9c3", stroke: "#fde047", strokeSelected: "#eab308", shadow: "rgba(234, 179, 8, 0.5)" },
  wall: { fill: "#d4d4d4", fillSelected: "#bfdbfe", stroke: "#737373", strokeSelected: "#3b82f6", shadow: "rgba(59, 130, 246, 0.5)" },
};

export const PALETTE_ITEMS: { type: ObjectType; tool: Tool; icon: typeof Square; label: string }[] = [
  { type: "table", tool: "add-rect", icon: Square, label: "Прямоугольный стол" },
  { type: "table", tool: "add-circle", icon: Circle, label: "Круглый стол" },
  { type: "bar", tool: "add-bar", icon: Wine, label: "Барная стойка" },
  { type: "toilet", tool: "add-toilet", icon: Bath, label: "Туалет" },
  { type: "wall", tool: "add-wall", icon: Minus, label: "Стена" },
];

export const HANDLE_CURSORS: Record<ResizeHandle, string> = {
  n: "cursor-ns-resize",
  s: "cursor-ns-resize",
  e: "cursor-ew-resize",
  w: "cursor-ew-resize",
  ne: "cursor-nesw-resize",
  sw: "cursor-nesw-resize",
  nw: "cursor-nwse-resize",
  se: "cursor-nwse-resize",
};

export const TOOL_TYPE_MAP: Record<string, ObjectType> = {
  "add-rect": "table",
  "add-circle": "table",
  "add-toilet": "toilet",
  "add-bar": "bar",
  "add-wall": "wall",
};
