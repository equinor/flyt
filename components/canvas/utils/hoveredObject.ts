import { getVsmTypeName } from "../../GetVsmTypeName";
import { vsmObject } from "../../../interfaces/VsmObject";

let hoveredObject: vsmObject | null = null;

export const getHoveredObject = () => hoveredObject;

export function setHoveredObject(vsmObject: vsmObject, dragObject: vsmObject) {
  if (vsmObject !== dragObject) {
    console.log(
      "set hovered object",
      getVsmTypeName(vsmObject.vsmObjectType?.pkObjectType),
      vsmObject.vsmObjectID
    );
    hoveredObject = vsmObject;
  }
}

export const clearHoveredObject = () => {
  hoveredObject = null;
};

let dragObject: vsmObject | null = null;
export function setDragObject(vsmObject: vsmObject) {
  dragObject = vsmObject;
}
export const getDragObject = () => dragObject;
