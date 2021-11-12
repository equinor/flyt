import { ChildObjectsEntity } from "interfaces/generated";
import { vsmObjectTypes } from "types/vsmObjectTypes";

export function calculateTaskSectionWidth(node: ChildObjectsEntity): number {
  const baseWidth = 28;

  const numberOfTasks = node.tasks.length;

  //Todo: improve this, using task height and card height
  const numberOfTasksPerBase =
    node.vsmObjectType.pkObjectType === vsmObjectTypes.waiting ? 2 : 4; //Depends on the card-height. Only waiting nodes have a smaller height atm.
  const numberOfBases = Math.ceil(numberOfTasks / numberOfTasksPerBase);
  return baseWidth * numberOfBases;
}
