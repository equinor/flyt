import { Task } from "types/Task";

export const getTaskShorthand = (task?: Task): string =>
  !task ? "?" : task.type.slice(0, 1) + (task.number + 1);
