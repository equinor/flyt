import * as PIXI from "pixi.js";
import { createArrayOfTaskCircles } from "./CreateArrayOfTaskCircles";
import { createGrid } from "../CreateGrid";
import { textResolution } from "../AssetFactory";
import { vsmObject } from "../../../../interfaces/VsmObject";

export function getTaskSection(
  numberOfTasksPerBase: number,
  assetTaskSection: PIXI.ILoaderResource,
  assetTaskSectionEdge: PIXI.ILoaderResource,
  vsmObject: vsmObject
): PIXI.Container {
  const numberOfTasks = vsmObject.tasks.length;
  const numberOfBases = Math.ceil(numberOfTasks / numberOfTasksPerBase);

  if (numberOfBases === 0) return null;

  const taskSection = new PIXI.Container();
  for (let i = 0; i < numberOfBases; i++) {
    const taskSectionBase = new PIXI.Sprite(assetTaskSection.texture);
    taskSectionBase.x = 28 * i;
    taskSection.addChild(taskSectionBase);
  }

  const taskSectionEdge = new PIXI.Sprite(assetTaskSectionEdge.texture);
  taskSectionEdge.x = 28 * numberOfBases;
  taskSection.addChild(taskSectionEdge);
  taskSection.x = 126;
  const tasks = vsmObject.tasks;
  if (tasks?.length > 0) {
    const {
      ideaCircle,
      problemCircle,
      questionCircle,
      riskCircle,
      unknownCircle,
    } = PIXI.Loader.shared.resources;
    const newTasks = createArrayOfTaskCircles(
      tasks,
      problemCircle,
      questionCircle,
      ideaCircle,
      riskCircle,
      unknownCircle,
      textResolution
    );
    const taskContainer = createGrid(newTasks, numberOfTasksPerBase, 2);
    taskSection.addChild(taskContainer);
  }
  return taskSection;
}
