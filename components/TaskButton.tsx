import { CElement } from "react";
import style from "./TaskButton.module.scss";
import { taskObject } from "../types/taskObject";
import { vsmTaskTypes } from "../types/vsmTaskTypes";
import { getTaskShorthand } from "utils/getTaskShorthand";

export function TaskButton({
  task,
  selected,
  draft,
}: {
  task: taskObject;
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
function getStyle(type: vsmTaskTypes): string {
  if (type === vsmTaskTypes.problem) return style.problem;
  if (type === vsmTaskTypes.question) return style.question;
  if (type === vsmTaskTypes.idea) return style.idea;
  if (type === vsmTaskTypes.risk) return style.risk;
  return style.unknown;
}
