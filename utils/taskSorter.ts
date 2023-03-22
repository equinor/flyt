import { taskObject } from "../interfaces/taskObject";
import { vsmTaskTypes } from "types/vsmTaskTypes";
/**
 * Sort tasks by type.
 * If the task is solved or its type is not found, it will be added to the end of the list.
 * @returns
 */
export const taskSorter =
  () =>
  (a: taskObject, b: taskObject): number => {
    if (!a || !b) return 1;

    if (a.solved && !b.solved) return 1;
    if (!a.solved && b.solved) return -1;

    return vsmTaskTypes[b.type] - vsmTaskTypes[a.type];
  };
