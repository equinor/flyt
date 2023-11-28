import { Task } from "../types/Task";
import { TaskTypes } from "types/TaskTypes";

export const taskSorter =
  () =>
  (a: Task, b: Task): number => {
    if (!a || !b) return 1;

    if (a.solved && !b.solved) return 1;
    if (!a.solved && b.solved) return -1;

    return (
      Object.keys(TaskTypes).indexOf(a.type.toLocaleLowerCase()) -
      Object.keys(TaskTypes).indexOf(b.type.toLocaleLowerCase())
    );
  };
