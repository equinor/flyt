import { Task } from "types/Task";

export const getQIPRContainerWidth = (tasks: Task[]): number => {
  const numTasks = tasks?.filter((task) => !task.solved).length;
  return (((numTasks / 4.000001) >> 0) + 1) * 33 + 2.5; // 33 = QIPR circle width. 2.5 = margin
};
