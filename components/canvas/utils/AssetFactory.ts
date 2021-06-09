import { vsmObject } from "../../../interfaces/VsmObject";
import * as PIXI from "pixi.js";
import { TextStyle } from "pixi.js";
import { vsmObjectTypes } from "../../../types/vsmObjectTypes";
import { getVsmTypeName } from "../../GetVsmTypeName";
import { formatCanvasText } from "./FormatCanvasText";
import { pointerEvents } from "../../VSMCanvas";
import {
  clearHoveredObject,
  getDragObject,
  setHoveredObject,
} from "./hoveredObject";
import { clickHandler } from "../entities/ClickHandler";
import { Dispatch } from "easy-peasy";
import { ProjectModel } from "store/store";

import { formatDuration } from "../../../types/timeDefinitions";

let sprites:
  | { sprite: PIXI.Container; data: vsmObject }
  | Record<string, unknown> = {};

const textResolution = 2; // Need to be at least 2 for not looking blurry. But higher resolution, higher performance hit....
const defaultTextStyle = {
  fill: 0x3d3d3d,
  fontFamily: "Equinor",
  fontWeight: "500",
  fontSize: 12,
  lineHeight: 16,
  letterSpacing: 0.2,
  wordWrapWidth: 100,
  wordWrap: true,
  breakWords: true,
  trim: true,
} as TextStyle;

export function assetFactory(
  vsmObject: vsmObject,
  dispatch: Dispatch<ProjectModel>
): PIXI.Container {
  if (!vsmObject) throw Error("vsmObject was not provided for factory");
  const sprite = getSprite(vsmObject) || newSprite(vsmObject, dispatch);
  if (!sprite) throw Error("Could not get or generate asset...");
  return sprite;
}

/**
 * Get existing sprite for vsmObject
 * @param vsmObject
 */
function getSprite(vsmObject: vsmObject): PIXI.Container | null {
  if (!vsmObject)
    throw new Error("You need to provide this method a vsmObject");

  const sprite = sprites[vsmObject.vsmObjectID];

  const oldObject = sprite && sprite.data;
  if (!oldObject) return null;
  if (nothingHasChangedOfImportanceForRenderingThisCard(oldObject, vsmObject)) {
    //No change since last generation -> Using cached sprite
    return sprite && sprite.sprite;
  }
  return null;
}

/**
 * Check that nothing has changed that is of importance for rendering a card on the canvas
 *
 *  We do a diff check one the following fields:
 *  - name
 *  - role
 *  - tasks
 *  - time
 *  - timeDefinition
 *
 * @param oldObject
 * @param newObject
 */
function nothingHasChangedOfImportanceForRenderingThisCard(
  oldObject: vsmObject,
  newObject: vsmObject
) {
  return (
    oldObject.name === newObject.name &&
    oldObject.role === newObject.role &&
    oldObject.tasks === newObject.tasks &&
    oldObject.time === newObject.time &&
    oldObject.timeDefinition === newObject.timeDefinition
  );
}

/**
 * Generate a new sprite and create or update the "sprites" for a given vsmObject
 * @param vsmObject
 * @param dispatch
 */
function newSprite(
  vsmObject: vsmObject,
  dispatch: { setSelectedObject: (arg0: vsmObject) => void }
) {
  console.info(`Creating sprite ${vsmObject.vsmObjectID}`);
  const { vsmObjectID } = vsmObject;
  const newSprite = createNewSprite(vsmObject);
  clickHandler(newSprite, () => dispatch.setSelectedObject(vsmObject));
  newSprite.on(pointerEvents.pointerover, () =>
    setHoveredObject(vsmObject, getDragObject())
  );
  newSprite.on(pointerEvents.pointerout, () => clearHoveredObject());
  sprites[vsmObjectID] = { sprite: newSprite, data: vsmObject };
  return newSprite;
}

/**
 * Clear all sprites
 */
export function clearSprites(): void {
  // console.info("clearing sprite sprites");
  sprites = {};
}

function createChoiceAsset(vsmObject: vsmObject) {
  const { choice } = PIXI.Loader.shared.resources;
  const wrapper = new PIXI.Container();
  const content = vsmObject.name;
  const contentText = new PIXI.Text(
    formatCanvasText(vsmObject.name || "Choice", 45),
    {
      fill: 0x3d3d3d,
      fontFamily: "Equinor",
      fontWeight: "500",
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.2,
      wordWrapWidth: 90,
      wordWrap: true,
      breakWords: true,
      trim: true,
      align: "center",
    }
  );
  contentText.resolution = textResolution;
  contentText.alpha = content ? 1 : 0.4;
  contentText.anchor.set(0.5, 0.5);
  contentText.x = 126 / 2;
  contentText.y = 126 / 2;
  wrapper.addChild(new PIXI.Sprite(choice.texture), contentText);
  return wrapper;
}

function getDefaultTextSprite(vsmObject: vsmObject, maxLength = 60) {
  const top = 8;
  const left = 12;
  const textSprite = new PIXI.Text(
    formatCanvasText(vsmObject.name, maxLength),
    defaultTextStyle
  );
  textSprite.resolution = textResolution;
  textSprite.y = top;
  textSprite.x = left;
  return textSprite;
}

function createGenericCardAsset(vsmObject: vsmObject) {
  const { generic } = PIXI.Loader.shared.resources;
  const textSprite = getDefaultTextSprite(vsmObject, 100);
  const wrapper = new PIXI.Container();
  wrapper.addChild(new PIXI.Sprite(generic.texture), textSprite);
  return wrapper;
}

function createMainActivityAsset(vsmObject: vsmObject) {
  const { mainActivity } = PIXI.Loader.shared.resources;
  const textSprite = getDefaultTextSprite(vsmObject, 100);
  const wrapper = new PIXI.Container();
  wrapper.addChild(new PIXI.Sprite(mainActivity.texture), textSprite);
  return wrapper;
}

function getRoleText(vsmObject: vsmObject) {
  const { role } = vsmObject;
  return new PIXI.Text(formatCanvasText(role ?? "", 16), defaultTextStyle);
}

function getTimeText(vsmObject: vsmObject) {
  const time = formatDuration(vsmObject.time, vsmObject.timeDefinition);
  return new PIXI.Text(formatCanvasText(time, 12), defaultTextStyle);
}

function createSubActivityAsset(vsmObject: vsmObject) {
  const textSprite = getDefaultTextSprite(vsmObject);
  const roleText = getRoleText(vsmObject);
  roleText.resolution = textResolution;
  roleText.y = 97;
  roleText.x = 12;

  const timeText = getTimeText(vsmObject);
  timeText.resolution = textResolution;
  timeText.y = 119;
  timeText.x = roleText.x;

  const { subActivity } = PIXI.Loader.shared.resources;
  const wrapper = new PIXI.Container();
  wrapper.addChild(
    new PIXI.Sprite(subActivity.texture),
    textSprite,
    roleText,
    timeText
  );
  return wrapper;
}

function createWaitingAsset(vsmObject: vsmObject) {
  const { waiting } = PIXI.Loader.shared.resources;
  const textSprite = getDefaultTextSprite(vsmObject);
  const timeText = getTimeText(vsmObject);
  timeText.resolution = textResolution;
  timeText.y = 37;
  timeText.x = 32;
  const wrapper = new PIXI.Container();
  wrapper.addChild(new PIXI.Sprite(waiting.texture), textSprite, timeText);
  return wrapper;
}

/**
 * Creates a new sprite (in a container) for a given vsmObjectType
 * @param vsmObject
 */
function createNewSprite(vsmObject: vsmObject): PIXI.Container {
  const { vsmObjectType } = vsmObject;

  switch (vsmObjectType.pkObjectType) {
    case vsmObjectTypes.process:
    case vsmObjectTypes.supplier:
    case vsmObjectTypes.output:
    case vsmObjectTypes.customer:
    case vsmObjectTypes.input:
      return createGenericCardAsset(vsmObject);
    case vsmObjectTypes.mainActivity:
      return createMainActivityAsset(vsmObject);
    case vsmObjectTypes.subActivity:
      return createSubActivityAsset(vsmObject);
    case vsmObjectTypes.waiting:
      return createWaitingAsset(vsmObject);
    case vsmObjectTypes.choice:
      return createChoiceAsset(vsmObject);
    default:
      throw Error(
        `Could not find a matching texture for ${getVsmTypeName(
          vsmObjectType.pkObjectType
        )}`
      );
  }
}
