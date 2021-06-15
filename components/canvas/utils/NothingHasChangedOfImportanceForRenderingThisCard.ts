import { vsmObject } from "../../../interfaces/VsmObject";

/**
 * Check that nothing has changed that is of importance for rendering a card on the canvas
 *
 *  We do a diff check one the following fields:
 *  - name
 *  - role
 *  - tasks
 *  - time
 *  - timeDefinition
 *
 * @param oldObject
 * @param newObject
 */
export function nothingHasChangedOfImportanceForRenderingThisCard(
  oldObject: vsmObject,
  newObject: vsmObject
): boolean {
  return (
    oldObject.name === newObject.name &&
    oldObject.role === newObject.role &&
    oldObject.tasks === newObject.tasks &&
    oldObject.time === newObject.time &&
    oldObject.timeDefinition === newObject.timeDefinition
  );
}
