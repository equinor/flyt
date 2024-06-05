import { CElement } from "react";
import style from "./TaskButton.module.scss";
import { Task } from "@/types/Task";
import { TaskTypes } from "@/types/TaskTypes";
import { getTaskShorthand } from "utils/getTaskShorthand";

export function TaskButton({
  task,
  selected,
  draft,
}: {
  task: Task;
  selected: boolean;
  draft: boolean;
}): CElement<unknown, never> {
  if (!task)
    return (
      <div
        className={`${style.unknown} ${selected && style.selected} ${
          draft && style.draft
        }`}
      >
        <p>{`${task}`}</p>
      </div>
    );

  return (
    <div
      className={`
        ${getStyle(task.type)}
        ${selected && style.selected} ${draft && style.draft} ${
        task.solved && style.solved
      }`}
    >
      <p>{getTaskShorthand(task)}</p>
    </div>
  );
}

/**
 * Get the corresponding style for the task type
 * @param type - The task type
 * @returns string - The corresponding style
 */
function getStyle(type: TaskTypes): string {
  if (type === TaskTypes.Problem) return style.problem;
  if (type === TaskTypes.Question) return style.question;
  if (type === TaskTypes.Idea) return style.idea;
  if (type === TaskTypes.Risk) return style.risk;
  return style.unknown;
}
