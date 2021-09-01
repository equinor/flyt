import { taskObject } from "../interfaces/taskObject";
import { vsmTaskTypes } from "../types/vsmTaskTypes";

export function getTaskColor(task: taskObject): string {
  switch (task?.fkTaskType) {
    case vsmTaskTypes.problem:
      return "#eb0000";
    case vsmTaskTypes.question:
      return "#ad6200";
    case vsmTaskTypes.idea:
      return "#00977b";
  }
  return "#000000";
}
