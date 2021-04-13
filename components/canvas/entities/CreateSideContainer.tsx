import * as PIXI from "pixi.js";
import { vsmTaskTypes } from "../../../types/vsmTaskTypes";
import { TextCircle } from "./TextCircle";
import { createGrid } from "./CreateGrid";
import { taskObject } from "../../../interfaces/taskObject";
import { taskSorter } from "../../../utils/taskSorter";

export function createSideContainer(
  tasks: taskObject[],
  breakAt = 4,
  height = 136
): PIXI.Container {
  const sideContainer = new PIXI.Container();
  if (tasks?.length > 0) {
    const newTasks = tasks.sort(taskSorter()).map((t) => {
      switch (t?.fkTaskType) {
        case vsmTaskTypes.problem:
          return TextCircle(`${t.displayIndex}`, 0xeb0000);
        case vsmTaskTypes.question:
          return TextCircle(`${t.displayIndex}`, 0xad6200);
        case vsmTaskTypes.idea:
          return TextCircle(`${t.displayIndex}`, 0x00977b);
        default:
          return TextCircle(`${t}`);
      }
    });

    const taskContainer = createGrid(newTasks, breakAt);
    const rectangleSide = new PIXI.Graphics();
    rectangleSide.beginFill(0xededed);
    rectangleSide.drawRect(0, 0, taskContainer.width + 16, height);
    rectangleSide.endFill();
    sideContainer.addChild(rectangleSide, taskContainer);
    taskContainer.x = 4;
    taskContainer.y = 2;
  }
  return sideContainer;
}
