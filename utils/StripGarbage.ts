import { vsmObject } from "../interfaces/VsmObject";

/**
 * Only keep what is essential for creating a new VSM with the same content
 * NB: currently it does not include tasks
 * -> the api does not support creating a new project with tasks. They need to be created* after and then linked...
 * > *Techically, we may re-use the same tasks as in the original project. Still would need to be manually linked.
 *
 * @param childObjects
 * @param choiceGroup
 * @param name
 * @param role
 * @param time
 * @param timeDefinition
 * @param pkObjectType
 */
export function stripGarbage({
  childObjects,
  choiceGroup,
  name,
  role,
  time,
  timeDefinition,
  vsmObjectType: { pkObjectType },
}: vsmObject) {
  const newObj = {};
  if (childObjects?.length > 0)
    newObj["childObjects"] = childObjects.map((o) => stripGarbage(o));
  if (choiceGroup) newObj["choiceGroup"] = choiceGroup;
  if (name) newObj["name"] = name;
  if (role) newObj["role"] = role;
  if (time) newObj["time"] = time;
  if (timeDefinition) newObj["timeDefinition"] = timeDefinition;

  return {
    ...newObj,
    fkObjectType: pkObjectType,
  };
}
