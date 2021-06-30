import { vsmObject } from "../../../interfaces/VsmObject";

let hoveredObject: vsmObject | null = null;

export const getHoveredObject = (): vsmObject | null => {
  console.log("Get hovered object", { hoveredObject });
  return hoveredObject;
};

export function setHoveredObject(
  vsmObject: vsmObject,
  dragObject: vsmObject
): void {
  console.log("setHoveredObject", { vsmObject, dragObject });
  if (vsmObject === dragObject) {
    console.error("vsmObject === dragObject", { vsmObject, dragObject });
  }
  hoveredObject = vsmObject;
}

export const clearHoveredObject = (): void => {
  hoveredObject = null;
};

let dragObject: vsmObject | null = null;

export function setDragObject(vsmObject: vsmObject): void {
  dragObject = vsmObject;
}

export const getDragObject = (): vsmObject | null => dragObject;
