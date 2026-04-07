import type { Camera, FloorObject } from "../model/types";
import { GRID_SIZE, HANDLE_SIZE, OBJECT_STYLES } from "../model/constants";
import { rotatePoint } from "./utils";

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  camera: Camera,
  width: number,
  height: number,
) {
  const gridSize = GRID_SIZE * camera.zoom;
  const offsetX = (camera.x * camera.zoom) % gridSize;
  const offsetY = (camera.y * camera.zoom) % gridSize;

  ctx.strokeStyle = "#e5e5e5";
  ctx.lineWidth = 1;

  for (let x = offsetX; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(Math.round(x) + 0.5, 0);
    ctx.lineTo(Math.round(x) + 0.5, height);
    ctx.stroke();
  }
  for (let y = offsetY; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, Math.round(y) + 0.5);
    ctx.lineTo(width, Math.round(y) + 0.5);
    ctx.stroke();
  }
}

export function getHandlePositions(obj: FloorObject, camera: Camera) {
  const cx = (obj.x + obj.width / 2 + camera.x) * camera.zoom;
  const cy = (obj.y + obj.height / 2 + camera.y) * camera.zoom;
  const hw = (obj.width / 2) * camera.zoom;
  const hh = (obj.height / 2) * camera.zoom;
  const half = HANDLE_SIZE / 2;
  const rot = obj.rotation;

  const raw = {
    nw: { x: -hw, y: -hh },
    n: { x: 0, y: -hh },
    ne: { x: hw, y: -hh },
    w: { x: -hw, y: 0 },
    e: { x: hw, y: 0 },
    sw: { x: -hw, y: hh },
    s: { x: 0, y: hh },
    se: { x: hw, y: hh },
  };

  const result: Record<string, { x: number; y: number }> = {};
  for (const [key, pos] of Object.entries(raw)) {
    const rotated = rotatePoint(cx + pos.x, cy + pos.y, cx, cy, rot);
    result[key] = { x: rotated.x - half, y: rotated.y - half };
  }
  return result;
}

function drawHandles(ctx: CanvasRenderingContext2D, obj: FloorObject, camera: Camera) {
  const positions = getHandlePositions(obj, camera);
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 1.5;
  for (const pos of Object.values(positions)) {
    ctx.beginPath();
    ctx.roundRect(pos.x, pos.y, HANDLE_SIZE, HANDLE_SIZE, 2);
    ctx.fill();
    ctx.stroke();
  }
}

export function drawFloorObject(
  ctx: CanvasRenderingContext2D,
  obj: FloorObject,
  camera: Camera,
  isSelected: boolean,
  isEditing: boolean,
) {
  const cx = (obj.x + obj.width / 2 + camera.x) * camera.zoom;
  const cy = (obj.y + obj.height / 2 + camera.y) * camera.zoom;
  const sw = obj.width * camera.zoom;
  const sh = obj.height * camera.zoom;
  const style = OBJECT_STYLES[obj.type];
  const rad = (obj.rotation * Math.PI) / 180;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rad);

  if (isSelected) {
    ctx.shadowColor = style.shadow;
    ctx.shadowBlur = 12;
  }

  ctx.fillStyle = isSelected ? style.fillSelected : style.fill;
  ctx.strokeStyle = isSelected ? style.strokeSelected : style.stroke;
  ctx.lineWidth = isSelected ? 2 : 1;

  if (obj.shape === "rect") {
    const radius = obj.type === "wall" ? 2 * camera.zoom : 8 * camera.zoom;
    ctx.beginPath();
    ctx.roundRect(-sw / 2, -sh / 2, sw, sh, radius);
    ctx.fill();
    ctx.stroke();
  } else {
    const r = Math.min(sw, sh) / 2;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#262626";
  ctx.font = `${Math.max(12, 14 * camera.zoom)}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (obj.type === "table") {
    ctx.fillText(obj.label, 0, -8 * camera.zoom);
    ctx.fillStyle = "#737373";
    ctx.font = `${Math.max(10, 11 * camera.zoom)}px Inter, system-ui, sans-serif`;
    ctx.fillText(`${obj.seats} мест`, 0, 10 * camera.zoom);
  } else if (obj.type === "wall") {
    if (sh > 18 * camera.zoom) {
      ctx.fillStyle = "#525252";
      ctx.font = `${Math.max(9, 10 * camera.zoom)}px Inter, system-ui, sans-serif`;
      ctx.fillText(obj.label, 0, 0);
    }
  } else {
    ctx.fillText(obj.label, 0, 0);
  }

  ctx.restore();

  if (isSelected && isEditing) {
    drawHandles(ctx, obj, camera);
  }
}
