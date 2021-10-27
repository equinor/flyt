import BaseAPIServices from "./BaseAPIServices";
import { taskCategory } from "../interfaces/taskCategory";

const baseUrl = "/api/v1.0";

// TASK-CATEGORIES

/**
 * Get categories for tasks in project
 * @param projectId
 */
export const getTaskCategories = (
  projectId: string | string[]
): Promise<Array<taskCategory>> => {
  return BaseAPIServices.get(
    baseUrl + `/taskCategory/forProject/${projectId}`
  ).then((value) => {
    if (value) return value.data;
    else throw Error("No data");
  });
};

export const getTaskCategory = (id: number) => {
  BaseAPIServices.get(baseUrl + `/taskCategory/${id}`).then(
    (value) => value.data
  );
};

export const patchTaskCategory = (category) => {
  return BaseAPIServices.patch(
    baseUrl + `/taskCategory/${category.id}`,
    category
  );
};

export const deleteTaskCategory = (id: number) => {
  return BaseAPIServices.delete(baseUrl + `/taskCategory/${id}`);
};

export const newTaskCategory = (category: taskCategory) => {
  return BaseAPIServices.post(baseUrl + `/taskCategory`, category);
};

export const linkTaskCategory = (
  categoryId: number | string | string[],
  taskId: number | string | string[]
) => {
  return BaseAPIServices.post(
    baseUrl + `/taskCategory/link/${categoryId}/${taskId}`,
    null
  ).then((r) => {
    return r.data;
  });
};

export const unlinkTaskCategory = (
  categoryId: number | string | string[],
  taskId: number | string | string[]
) => {
  return BaseAPIServices.delete(
    baseUrl + `/taskCategory/link/${categoryId}/${taskId}`
  );
};
