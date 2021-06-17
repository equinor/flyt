import { formatDuration } from "../../../../types/timeDefinitions";
import * as PIXI from "pixi.js";
import { formatCanvasText } from "../FormatCanvasText";
import { defaultTextStyle } from "../AssetFactory";
import { vsmObject } from "../../../../interfaces/VsmObject";

export function getTimeText(vsmObject: vsmObject): PIXI.Text {
  const time = formatDuration(vsmObject.time, vsmObject.timeDefinition);
  return new PIXI.Text(formatCanvasText(time, 12), defaultTextStyle);
}
