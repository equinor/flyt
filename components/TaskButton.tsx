import React from "react";
import style from "./TaskButton.module.scss";
import { taskObject } from "../interfaces/taskObject";
import { vsmTaskTypes } from "../types/vsmTaskTypes";

export function TaskButton({
  task,
  selected,
  draft,
}: {
  task: taskObject;
  selected: boolean;
  draft: boolean;
}): React.CElement<unknown, never> {
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
        ${getStyle(task.fkTaskType)}
        ${selected && style.selected} ${draft && style.draft} ${
        task.solved && style.solved
      }`}
    >
      <p>{task.displayIndex}</p>
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
