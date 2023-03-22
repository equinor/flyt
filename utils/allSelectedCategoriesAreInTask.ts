import { taskCategory } from "../interfaces/taskCategory";
import { taskObject } from "../interfaces/taskObject";

export function allSelectedCategoriesAreInTask(
  checkedCategories: Array<taskCategory>,
  t: taskObject
): boolean {
  let shouldShow = true;
  checkedCategories.forEach((category) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const exists = t.categories.some((c) => c.id === category.id);
    if (!exists) shouldShow = false;
  });
  return shouldShow;
}
