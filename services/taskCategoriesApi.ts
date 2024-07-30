import BaseAPIServices from "./BaseAPIServices";
import { TaskCategory } from "@/types/TaskCategory";

const baseUrl = "/api/v2.0";

// TASK-CATEGORIES

/**
 * Get categories for tasks in project
 * @param projectId
 */
export const getTaskCategories = (
  projectId: string | string[]
): Promise<TaskCategory[]> => {
  return BaseAPIServices.get(`${baseUrl}/graph/${projectId}/categories`).then(
    (value) => {
      if (value) return value.data as TaskCategory[];
      else throw Error("No data");
    }
  );
};

export const postTaskCategory = (projectId: string, category: TaskCategory) => {
  return BaseAPIServices.post(
    `${baseUrl}/graph/${projectId}/categories`,
    category
  );
};

export const updateTaskCategory = (
  projectId: string | string[],
  category: TaskCategory
) => {
  return BaseAPIServices.patch(
    `${baseUrl}/graph/${projectId}/categories/${category.id}`,
    category
  );
};

export const deleteTaskCategory = (
  projectId: string | string[],
  id: number
) => {
  return BaseAPIServices.delete(
    `${baseUrl}/graph/${projectId}/categories/${id}`
  );
};

export const linkTaskCategory = (
  projectId: string | string[],
  categoryId: number | string | string[],
  taskId: number | string | string[]
) => {
  return BaseAPIServices.put(
    `${baseUrl}/graph/${projectId}/categories/${categoryId}`,
    { taskId: taskId }
  ).then((r) => {
    return r.data;
  });
};

export const unlinkTaskCategory = (
  projectId: string | string[],
  categoryId: number | string | string[],
  taskId: number | string | string[]
) => {
  return BaseAPIServices.delete(
    `${baseUrl}/graph/${projectId}/categories/${categoryId}/tasks/${taskId}`
  );
};
