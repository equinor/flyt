import { taskObject } from "../../../../interfaces/taskObject";
import { taskSorter } from "../../../../utils/taskSorter";
import { vsmTaskTypes } from "../../../../types/vsmTaskTypes";
import { TextCircle } from "../../entities/TextCircle";
import { ILoaderResource } from "@pixi/loaders";
import * as PIXI from "pixi.js";

export function createArrayOfTaskCircles(
  tasks: taskObject[],
  problemCircle: ILoaderResource,
  questionCircle: ILoaderResource,
  ideaCircle: ILoaderResource,
  riskCircle: ILoaderResource,
  unknownCircle: ILoaderResource,
  textResolution: number
): Array<PIXI.Container> {
  return tasks.sort(taskSorter()).map((t) => {
    switch (t?.fkTaskType) {
      case vsmTaskTypes.problem:
        return TextCircle(`${t.displayIndex}`, problemCircle, textResolution);
      case vsmTaskTypes.question:
        return TextCircle(`${t.displayIndex}`, questionCircle, textResolution);
      case vsmTaskTypes.idea:
        return TextCircle(`${t.displayIndex}`, ideaCircle, textResolution);
      case vsmTaskTypes.risk:
        return TextCircle(`${t.displayIndex}`, riskCircle, textResolution);
      default:
        return TextCircle(`${t}`, unknownCircle, textResolution);
    }
  });
}
