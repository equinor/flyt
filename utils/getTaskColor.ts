import { Task } from "@/types/Task";
import { TaskTypes } from "@/types/TaskTypes";

export function getTaskColor(task?: Task): string {
  switch (task?.type) {
    case TaskTypes.Problem:
      return "#eb0000";
    case TaskTypes.Question:
      return "#ad6200";
    case TaskTypes.Idea:
      return "#00977b";
    case TaskTypes.Risk:
      return "#ff9101";
  }
  return "#000000";
}
