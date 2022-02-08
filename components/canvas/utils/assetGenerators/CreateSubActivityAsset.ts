import * as PIXI from "pixi.js";

import { getDefaultTextSprite } from "./GetDefaultTextSprite";
import { getRoleText } from "./GetRoleText";
import { getTaskSection } from "./GetTaskSection";
import { getTimeText } from "./GetTimeText";
import { vsmObject } from "../../../../interfaces/VsmObject";

export function createSubActivityAsset(
  vsmObject: vsmObject,
  placeholder = "",
  textResolution: number
): PIXI.Container {
  const textSprite = getDefaultTextSprite(
    vsmObject,
    70,
    placeholder,
    textResolution
  );

  const roleText = getRoleText(vsmObject);
  roleText.resolution = textResolution;
  roleText.y = 97;
  roleText.x = 12;

  const timeText = getTimeText(vsmObject);
  timeText.resolution = textResolution;
  timeText.y = 119;
  timeText.x = 12;

  const {
    subActivity,
    subActivityStraight,
    genericTaskSection,
    genericTaskSectionEdge,
  } = PIXI.Loader.shared.resources;

  // Remember to not include solved tasks
  const gotTasks = vsmObject.tasks.filter((task) => !task.solved).length > 0;
  const texture = gotTasks ? subActivityStraight.texture : subActivity.texture;
  const subActivitySprite = new PIXI.Sprite(texture);

  const wrapper = new PIXI.Container();
  wrapper.addChild(subActivitySprite, textSprite, roleText, timeText);

  if (gotTasks) {
    const taskSection = getTaskSection(
      4,
      genericTaskSection,
      genericTaskSectionEdge,
      vsmObject
    );
    if (taskSection) wrapper.addChild(taskSection);
  }

  const mask = new PIXI.Graphics();
  mask.drawRect(0, 0, 126, 88);
  textSprite.mask = mask;
  wrapper.addChild(mask);

  return wrapper;
}
