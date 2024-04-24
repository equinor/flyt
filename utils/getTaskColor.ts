import { Task } from "../types/Task";
import { TaskTypes } from "../types/TaskTypes";

export function getTaskColor(task: Task): string {
  switch (task?.type) {
    case TaskTypes.problem:
      return "#eb0000";
    case TaskTypes.question:
      return "#ad6200";
    case TaskTypes.idea:
      return "#00977b";
    case TaskTypes.risk:
      return "#ff9101";
  }
  return "#000000";
}
