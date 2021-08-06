import * as PIXI from "pixi.js";
import { getDefaultTextSprite } from "./GetDefaultTextSprite";
import { vsmObject } from "../../../../interfaces/VsmObject";
import { getTaskSection } from "./GetTaskSection";

export function createMainActivityAsset(
  vsmObject: vsmObject,
  placeholder = "",
  textResolution: number
): PIXI.Container {
  const wrapper = new PIXI.Container();
  const {
    mainActivity,
    mainActivityStraight,
    genericTaskSection,
    genericTaskSectionEdge,
  } = PIXI.Loader.shared.resources;
  //CARD
  const gotTasks = vsmObject.tasks.length > 0;
  const texture = gotTasks
    ? mainActivityStraight.texture
    : mainActivity.texture;
  const cardSprite = new PIXI.Sprite(texture);

  wrapper.addChild(cardSprite);
  //TASK_SECTION
  const taskSection = getTaskSection(
    4,
    genericTaskSection,
    genericTaskSectionEdge,
    vsmObject
  );
  if (taskSection) wrapper.addChild(taskSection);

  const textSprite = getDefaultTextSprite(
    vsmObject,
    100,
    placeholder,
    textResolution
  );

  wrapper.addChild(textSprite);

  const mask = new PIXI.Graphics();
  mask.drawRect(0, 0, 126, 134);
  textSprite.mask = mask;
  wrapper.addChild(mask);

  return wrapper;
}
