import * as PIXI from "pixi.js";
import { formatCanvasText } from "../FormatCanvasText";
import { defaultTextStyle } from "../AssetFactory";
import { vsmObject } from "../../../../interfaces/VsmObject";

export function getRoleText(vsmObject: vsmObject): PIXI.Text {
  const { role } = vsmObject;
  return new PIXI.Text(formatCanvasText(role ?? "", 16), defaultTextStyle);
}
