import { vsmObject } from "../../../interfaces/VsmObject";

let hoveredObject: vsmObject | null = null;

export const getHoveredObject = (): vsmObject | null => hoveredObject;

export function setHoveredObject(
  vsmObject: vsmObject,
  dragObject: vsmObject
): void {
  if (vsmObject !== dragObject) hoveredObject = vsmObject;
}

export const clearHoveredObject = (): void => {
  hoveredObject = null;
};

let dragObject: vsmObject | null = null;

export function setDragObject(vsmObject: vsmObject): void {
  dragObject = vsmObject;
}

export const getDragObject = (): vsmObject | null => dragObject;
