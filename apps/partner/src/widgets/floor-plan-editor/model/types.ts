export type ObjectType = "table" | "toilet" | "bar" | "wall";

export type Tool = "select" | "add-rect" | "add-circle" | "add-toilet" | "add-bar" | "add-wall";

export type ResizeHandle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export interface FloorObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  shape: "rect" | "circle";
  type: ObjectType;
  seats: number;
  label: string;
}

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}
