import { vsmTaskTypes } from "../types/vsmTaskTypes";
import React from "react";
import style from "./TaskButton.module.scss";
import { taskObject } from "../interfaces/taskObject";

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

  switch (task.fkTaskType) {
    case vsmTaskTypes.problem:
      return (
        <div
          className={`${style.problem} ${selected && style.selected} ${
            draft && style.draft
          }`}
        >
          <p>{task.dsiplayIndex}</p>
        </div>
      );
    case vsmTaskTypes.question:
      return (
        <div
          className={`${style.question} ${selected && style.selected} ${
            draft && style.draft
          }`}
        >
          <p>{task.dsiplayIndex}</p>
        </div>
      );
    case vsmTaskTypes.idea:
      return (
        <div
          className={`${style.idea} ${selected && style.selected} ${
            draft && style.draft
          }`}
        >
          <p>{task.dsiplayIndex}</p>
        </div>
      );
    default:
      return (
        <div
          className={`${style.unknown} ${selected && style.selected} ${
            draft && style.draft
          }`}
        >
          <p>{task.dsiplayIndex}</p>
        </div>
      );
  }
}
