import type { Camera, FloorObject, ResizeHandle } from "../model/types";
import { HANDLE_SIZE } from "../model/constants";
import { getHandlePositions } from "./canvas";
import { rotatePoint } from "./utils";

export function hitTest(x: number, y: number, obj: FloorObject, camera: Camera): boolean {
  const wx = x / camera.zoom - camera.x;
  const wy = y / camera.zoom - camera.y;

  const ocx = obj.x + obj.width / 2;
  const ocy = obj.y + obj.height / 2;

  const local = rotatePoint(wx, wy, ocx, ocy, -obj.rotation);

  if (obj.shape === "rect") {
    return (
      local.x >= obj.x &&
      local.x <= obj.x + obj.width &&
      local.y >= obj.y &&
      local.y <= obj.y + obj.height
    );
  }

  const r = Math.min(obj.width, obj.height) / 2;
  return (local.x - ocx) ** 2 + (local.y - ocy) ** 2 <= r ** 2;
}

export function hitTestHandle(
  px: number,
  py: number,
  obj: FloorObject,
  camera: Camera,
): ResizeHandle | null {
  const positions = getHandlePositions(obj, camera);
  const tolerance = HANDLE_SIZE + 4;

  for (const [handle, pos] of Object.entries(positions)) {
    const cx = pos.x + HANDLE_SIZE / 2;
    const cy = pos.y + HANDLE_SIZE / 2;
    if (Math.abs(px - cx) <= tolerance / 2 && Math.abs(py - cy) <= tolerance / 2) {
      return handle as ResizeHandle;
    }
  }
  return null;
}
