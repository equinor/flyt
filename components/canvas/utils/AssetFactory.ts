import { vsmObject } from "../../../interfaces/VsmObject";
import * as PIXI from "pixi.js";
import { TextStyle } from "pixi.js";
import { vsmObjectTypes } from "../../../types/vsmObjectTypes";
import {
  clearHoveredObject,
  getDragObject,
  setHoveredObject,
} from "./hoveredObject";
import { clickHandler } from "./ClickHandler";
import { Dispatch } from "easy-peasy";
import { ProjectModel } from "store/store";
import { pointerEvents } from "../../../types/PointerEvents";
import { createGenericCardAsset } from "./assetGenerators/CreateGenericCardAsset";
import { createErrorCardAsset } from "./assetGenerators/CreateErrorCardAsset";
import { createMainActivityAsset } from "./assetGenerators/CreateMainActivityAsset";
import { createSubActivityAsset } from "./assetGenerators/CreateSubActivityAsset";
import { createWaitingAsset } from "./assetGenerators/CreateWaitingAsset";
import { createChoiceAsset } from "./assetGenerators/CreateChoiceAsset";
import { nothingHasChangedOfImportanceForRenderingThisCard } from "./NothingHasChangedOfImportanceForRenderingThisCard";

let sprites:
  | { sprite: PIXI.Container; data: vsmObject }
  | Record<string, unknown> = {};

export const textResolution = 2; // Need to be at least 2 for not looking blurry. But higher resolution, higher performance hit....
export const defaultTextStyle = {
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
 * Generate a new sprite and create or update the "sprites" for a given vsmObject
 * @param vsmObject
 * @param dispatch
 */
function newSprite(
  vsmObject: vsmObject,
  dispatch: { setSelectedObject: (arg0: vsmObject) => void }
) {
  const { vsmObjectID } = vsmObject;
  const newSprite = createNewSprite(vsmObject, textResolution);
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
  sprites = {};
}

/**
 * Creates a new sprite (in a container) for a given vsmObjectType
 * @param vsmObject
 * @param textResolution
 */
function createNewSprite(
  vsmObject: vsmObject,
  textResolution: number
): PIXI.Container {
  const { vsmObjectType } = vsmObject;

  switch (vsmObjectType?.pkObjectType) {
    case vsmObjectTypes.process:
      return createGenericCardAsset(vsmObject, "Process", textResolution);
    case vsmObjectTypes.supplier:
      return createGenericCardAsset(vsmObject, "Supplier", textResolution);
    case vsmObjectTypes.output:
      return createGenericCardAsset(vsmObject, "Output", textResolution);
    case vsmObjectTypes.customer:
      return createGenericCardAsset(vsmObject, "Customer", textResolution);
    case vsmObjectTypes.input:
      return createGenericCardAsset(vsmObject, "Input", textResolution);
    case vsmObjectTypes.mainActivity:
      return createMainActivityAsset(vsmObject, textResolution);
    case vsmObjectTypes.subActivity:
      return createSubActivityAsset(vsmObject, textResolution);
    case vsmObjectTypes.waiting:
      return createWaitingAsset(vsmObject, textResolution);
    case vsmObjectTypes.choice:
      return createChoiceAsset(vsmObject, textResolution);
    default:
      return createErrorCardAsset(vsmObject, textResolution);
  }
}