import * as PIXI from "pixi.js";
import { taskSorter } from "../../SideBarContent";
import { vsmTaskTypes } from "../../../types/vsmTaskTypes";
import { TextCircle } from "./TextCircle";
import { createGrid } from "./CreateGrid";
import { taskObject } from "../../../interfaces/taskObject";

export function createSideContainer(
  tasks: taskObject[],
  breakAt: number,
  height = 136
): PIXI.Container {
  const sideContainer = new PIXI.Container();
  if (tasks?.length > 0) {
    const newTasks = tasks.sort(taskSorter()).map((t) => {
      switch (t?.fkTaskType) {
        case vsmTaskTypes.problem:
          return TextCircle(`P${t.vsmTaskID}`, 0xff0000);
        case vsmTaskTypes.question:
          return TextCircle(`Q${t.vsmTaskID}`, 0x007079);
        case vsmTaskTypes.idea:
          return TextCircle(`I${t.vsmTaskID}`, 0xff6670);
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
