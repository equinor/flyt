import * as PIXI from "pixi.js";

import { getDefaultTextSprite } from "./GetDefaultTextSprite";
import { getTaskSection } from "./GetTaskSection";
import { getTimeText } from "./GetTimeText";
import { vsmObject } from "../../../../interfaces/VsmObject";

export function createWaitingAsset(
  vsmObject: vsmObject,
  textResolution: number
): PIXI.Container {
  const textSprite = getDefaultTextSprite(
    vsmObject,
    null,
    null,
    textResolution
  );
  const timeText = getTimeText(vsmObject);
  timeText.resolution = textResolution;
  timeText.y = 37;
  timeText.x = 32;

  const {
    waiting,
    waitingStraight,
    waitingTaskSection,
    waitingTaskSectionEdge,
  } = PIXI.Loader.shared.resources;

  // Remember to not include solved tasks
  const gotTasks = vsmObject.tasks.filter((task) => !task.solved).length > 0;
  const texture = gotTasks ? waitingStraight.texture : waiting.texture;
  const waitingSprite = new PIXI.Sprite(texture);

  const wrapper = new PIXI.Container();
  wrapper.addChild(waitingSprite, textSprite, timeText);

  if (gotTasks) {
    const taskSection = getTaskSection(
      2,
      waitingTaskSection,
      waitingTaskSectionEdge,
      vsmObject
    );
    if (taskSection) wrapper.addChild(taskSection);
  }

  return wrapper;
}
