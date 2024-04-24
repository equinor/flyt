import { Task } from "types/Task";

export const getTaskShorthand = (task: Task): string =>
  task?.type?.slice(0, 1) + (task.number + 1);
