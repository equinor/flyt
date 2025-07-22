import { Task } from "@/types/Task";
import { exportPQIRHeaders } from "../types/ExportFormat";
import { taskSorter } from "./taskSorter";

export const getFormattedPQIRData = (tasks: Task[]) => {
  const { id, type, description, activityType, category, stakeholder } =
    exportPQIRHeaders;
  return tasks?.sort(taskSorter()).map((task) => {
    const categories = task?.category.length
      ? task.category.map((category: { name: string }) => category.name).join()
      : "-";
    const activityTypes = task?.activityType.split(",") || [];
    const unqiueActivityType = activityTypes
      .filter((item, index) => activityTypes.indexOf(item) === index)
      .join(",");
    const idType = task.type.slice(0, 1);
    const stakeholders = task?.role.split(",") || [];
    const unqiueStakeholder = stakeholders
      .filter((item, index) => stakeholders.indexOf(item) === index)
      .join(",");

    return {
      [id]: `${idType}${task.number + 1}`,
      [type]: task?.type || "-",
      [description]: task?.description || "-",
      [activityType]: unqiueActivityType || "-",
      [category]: categories,
      [stakeholder]: unqiueStakeholder || "-",
    };
  });
};
