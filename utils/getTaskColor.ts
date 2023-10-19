import { taskObject } from "../types/taskObject";
import { vsmTaskTypes } from "../types/vsmTaskTypes";

export function getTaskColor(task: taskObject): string {
  switch (task?.type) {
    case vsmTaskTypes.problem:
      return "#eb0000";
    case vsmTaskTypes.question:
      return "#ad6200";
    case vsmTaskTypes.idea:
      return "#00977b";
    case vsmTaskTypes.risk:
      return "#ff9101";
  }
  return "#000000";
}
