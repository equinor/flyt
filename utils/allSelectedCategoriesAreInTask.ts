import { taskCategory } from "../interfaces/taskCategory";
import { taskObject } from "../interfaces/taskObject";

export function allSelectedCategoriesAreInTask(
  checkedCategories: Array<taskCategory>,
  t: taskObject
): boolean {
  let shouldShow = true;
  checkedCategories.forEach((category) => {
    const exists = t.categories.some((c) => c.id === category.id);
    if (!exists) shouldShow = false;
  });
  return shouldShow;
}
