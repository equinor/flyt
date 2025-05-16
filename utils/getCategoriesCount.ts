import { Task } from "@/types/Task";
import { TaskTypes } from "@/types/TaskTypes";

export const getCategoriesCount = (
  type: TaskTypes,
  tasks: Task[] | undefined
) => {
  if (!tasks || !tasks.length) return [];
  const filteredTasks = tasks
    .filter((task: { type: TaskTypes }) => task.type === type)
    .map((task: { category: any }) => task.category)
    .flat(1)
    .map((category: { name: any }) => category.name);
  return Array.from(new Set(filteredTasks));
};
