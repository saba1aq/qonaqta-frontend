import { GRID_SIZE } from "../model/constants";

export function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export function rotatePoint(
  px: number,
  py: number,
  cx: number,
  cy: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = px - cx;
  const dy = py - cy;
  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  };
}
