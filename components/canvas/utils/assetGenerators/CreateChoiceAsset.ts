import * as PIXI from "pixi.js";
import { formatCanvasText } from "../FormatCanvasText";
import { vsmObject } from "../../../../interfaces/VsmObject";

export function createChoiceAsset(
  vsmObject: vsmObject,
  textResolution: number
): PIXI.Container {
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
