import { Task } from "@/types/Task";

export const getFormattedPQIRData = (tasks: Task[]) => {
  return tasks.map((task) => {
    const categories = task.category.length
      ? task.category.map((category: { name: string }) => category.name).join()
      : "-";
    const idType = task.type.slice(0, 1);
    return {
      ID: `${idType}${task.number + 1}`,
      Type: task.type,
      Description: task.description,
      "Activity Type": task.activityType,
      Category: categories,
      Stakeholder: task.role,
    };
  });
};
