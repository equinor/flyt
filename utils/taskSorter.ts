import { taskObject } from "../interfaces/taskObject";

export const taskSorter = () => (a: taskObject, b: taskObject): number => {
  if (!!a && !!b) return a.fkTaskType - b.fkTaskType;
  return 1;
};
