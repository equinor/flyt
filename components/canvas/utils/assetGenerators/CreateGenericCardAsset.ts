import * as PIXI from "pixi.js";

import { defaultTextStyle } from "../AssetFactory";
import { getDefaultTextSprite } from "./GetDefaultTextSprite";
import { getTaskSection } from "./GetTaskSection";
import { vsmObject } from "../../../../interfaces/VsmObject";

export function createGenericCardAsset(
  vsmObject: vsmObject,
  title = "",
  textResolution: number
) {
  const wrapper = new PIXI.Container();
  const {
    generic,
    genericStraight,
    genericTaskSection,
    genericTaskSectionEdge,
  } = PIXI.Loader.shared.resources;
  //CARD
  // Remember to not include solved tasks in the number of tasks per base
  const gotTasks = vsmObject?.tasks?.filter((task) => !task.solved).length > 0;
  const texture = gotTasks ? genericStraight.texture : generic.texture;
  const cardSprite = new PIXI.Sprite(texture);
  wrapper.addChild(cardSprite);

  if (gotTasks) {
    //TASK_SECTION
    const taskSection = getTaskSection(
      4,
      genericTaskSection,
      genericTaskSectionEdge,
      vsmObject
    );
    if (taskSection) wrapper.addChild(taskSection);
  }

  //CARD_TITLE
  if (title) {
    const titleSprite = new PIXI.Text(title, defaultTextStyle);
    titleSprite.alpha = 0.4;
    titleSprite.y = 8;
    titleSprite.x = 12;
    wrapper.addChild(titleSprite);
  }

  //CARD CONTENT
  const textSprite = getDefaultTextSprite(vsmObject, 100, null, textResolution);
  textSprite.y = 21;
  wrapper.addChild(textSprite);

  const mask = new PIXI.Graphics();
  mask.drawRect(0, 0, 126, 134);
  textSprite.mask = mask;
  wrapper.addChild(mask);

  return wrapper;
}
