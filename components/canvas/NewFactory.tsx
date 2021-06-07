import { vsmObject } from "../../interfaces/VsmObject";
import * as PIXI from "pixi.js";
import { vsmObjectTypes } from "../../types/vsmObjectTypes";
import { getVsmTypeName } from "../GetVsmTypeName";
import { formatCanvasText } from "./FormatCanvasText";

let sprites = {};

/**
 * Get existing sprite for vsmObject
 * @param vsmObject
 */
function getSprite(vsmObject: vsmObject) {
  if (sprites[vsmObject.vsmObjectID]) console.info(`Using existing sprite`);
  return sprites[vsmObject.vsmObjectID];
}

export function newFactory(vsmObject: vsmObject): PIXI.Sprite {
  if (!vsmObject) throw Error("vsmObject was not provided for factory");
  return getSprite(vsmObject) || newSprite(vsmObject);
}

/**
 * Generate a new sprite and create or update the "cache" for a given vsmObject
 * @param vsmObject
 */
function newSprite(vsmObject: vsmObject) {
  console.info(`Creating sprite`);
  const { vsmObjectID } = vsmObject;
  const newSprite = createNewSprite(vsmObject);
  sprites[vsmObjectID] = newSprite;
  return newSprite;
}

/**
 * Clear all sprites
 */
export function clearSprites(): void {
  console.info("clearing sprite pool");
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
  contentText.resolution = 3;
  contentText.alpha = content ? 1 : 0.4;
  contentText.anchor.set(0.5, 0.5);
  contentText.x = 126 / 2;
  contentText.y = 126 / 2;
  wrapper.addChild(new PIXI.Sprite(choice.texture), contentText);
  return wrapper;
}

function getDefaultTextSprite(vsmObject: vsmObject) {
  const top = 8;
  const left = 4;
  const width = 126 - left - left;
  const textSprite = new PIXI.Text(formatCanvasText(vsmObject.name), {
    fill: 0x3d3d3d,
    fontFamily: "Equinor",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
    wordWrapWidth: width,
    wordWrap: true,
    breakWords: true,
    trim: true,
  });
  textSprite.resolution = 3;
  textSprite.y = top;
  textSprite.x = left;
  return textSprite;
}

function createGenericCardAsset(vsmObject: vsmObject) {
  const { generic } = PIXI.Loader.shared.resources;
  const textSprite = getDefaultTextSprite(vsmObject);
  const wrapper = new PIXI.Container();
  wrapper.addChild(new PIXI.Sprite(generic.texture), textSprite);
  return wrapper;
}

function createMainActivityAsset(vsmObject: vsmObject) {
  const { mainActivity } = PIXI.Loader.shared.resources;
  const textSprite = getDefaultTextSprite(vsmObject);
  const wrapper = new PIXI.Container();
  wrapper.addChild(new PIXI.Sprite(mainActivity.texture), textSprite);
  return wrapper;
}

function createSubActivityAsset(vsmObject: vsmObject) {
  const { subActivity } = PIXI.Loader.shared.resources;
  const textSprite = getDefaultTextSprite(vsmObject);
  const wrapper = new PIXI.Container();
  wrapper.addChild(new PIXI.Sprite(subActivity.texture), textSprite);
  return wrapper;
}

function createWaitingAsset(vsmObject: vsmObject) {
  const { waiting } = PIXI.Loader.shared.resources;
  const textSprite = getDefaultTextSprite(vsmObject);
  const wrapper = new PIXI.Container();
  wrapper.addChild(new PIXI.Sprite(waiting.texture), textSprite);
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
