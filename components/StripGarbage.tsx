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
 * @param pkObjectType
 */
export function stripGarbage({
  childObjects,
  choiceGroup,
  name,
  vsmObjectType: { pkObjectType },
}: vsmObject) {
  const newObj = {};
  if (name) newObj["name"] = name;
  if (choiceGroup) newObj["choiceGroup"] = choiceGroup;
  if (childObjects?.length > 0)
    newObj["childObjects"] = childObjects.map((o) => stripGarbage(o));

  return {
    ...newObj,
    fkObjectType: pkObjectType,
  };
}
