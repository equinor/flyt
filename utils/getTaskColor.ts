import { taskObject } from "../interfaces/taskObject";
import { vsmTaskTypes } from "../types/vsmTaskTypes";

export function getTaskColor(task: taskObject): string {
  switch (task?.type) {
    case "Problem":
      return "#eb0000";
    case "Question":
      return "#ad6200";
    case "Idea":
      return "#00977b";
    case "Risk":
      return "#ff9101";
  }
  return "#000000";
}
