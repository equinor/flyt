import { vsmObject } from "../../../interfaces/VsmObject";

/**
 * Check that nothing has changed that is of importance for rendering a card on the canvas
 *
 *  We do a diff check one the following fields:
 *  - name
 *  - role
 *  - tasks
 *  - duration
 *  - unit
 *
 * @param oldObject
 * @param newObject
 */
export function nothingHasChangedOfImportanceForRenderingThisCard(
  oldObject: vsmObject,
  newObject: vsmObject
): boolean {
  return (
    oldObject.description === newObject.description &&
    oldObject.role === newObject.role &&
    oldObject.tasks === newObject.tasks &&
    oldObject.duration === newObject.duration &&
    oldObject.unit === newObject.unit
  );
}
