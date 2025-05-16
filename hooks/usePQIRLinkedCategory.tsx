import { Task } from "@/types/Task";
import { TaskTypes } from "@/types/TaskTypes";
import { getCategoriesCount } from "@/utils/getCategoriesCount";

export function usePQIRLinkedCategory(tasks: Task[] | undefined) {
  const categoriesLinkedToProblems = getCategoriesCount(
    TaskTypes.Problem,
    tasks
  );
  const categoriesLinkedToQuestion = getCategoriesCount(
    TaskTypes.Question,
    tasks
  );
  const categoriesLinkedToIdea = getCategoriesCount(TaskTypes.Idea, tasks);
  const categoriesLinkedToRisk = getCategoriesCount(TaskTypes.Risk, tasks);

  return {
    categoriesLinkedToProblems,
    categoriesLinkedToQuestion,
    categoriesLinkedToIdea,
    categoriesLinkedToRisk,
  };
}
