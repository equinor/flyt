import { getDefaultTextSprite } from "./GetDefaultTextSprite";
import { getRoleText } from "./GetRoleText";
import { getTimeText } from "./GetTimeText";
import * as PIXI from "pixi.js";
import { getTaskSection } from "./GetTaskSection";
import { vsmObject } from "../../../../interfaces/VsmObject";

export function createSubActivityAsset(
  vsmObject: vsmObject,
  textResolution: number
): PIXI.Container {
  const textSprite = getDefaultTextSprite(vsmObject, 100, null, textResolution);

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

  const gotTasks = vsmObject.tasks.length > 0;
  const texture = gotTasks ? subActivityStraight.texture : subActivity.texture;
  const subActivitySprite = new PIXI.Sprite(texture);

  const wrapper = new PIXI.Container();
  wrapper.addChild(subActivitySprite, textSprite, roleText, timeText);

  const taskSection = getTaskSection(
    4,
    genericTaskSection,
    genericTaskSectionEdge,
    vsmObject
  );
  if (taskSection) wrapper.addChild(taskSection);

  return wrapper;
}
