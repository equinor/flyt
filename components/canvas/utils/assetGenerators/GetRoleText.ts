import * as PIXI from "pixi.js";
import { TextStyle } from "pixi.js";
import { formatCanvasText } from "../FormatCanvasText";
import { vsmObject } from "../../../../interfaces/VsmObject";

const roleTextStyle = {
  fill: 0x3d3d3d,
  fontFamily: "Equinor",
  fontWeight: "500",
  fontSize: 12,
  lineHeight: 15,
  letterSpacing: 0.2,
  wordWrapWidth: 100,
  wordWrap: false,
  breakWords: false,
  trim: true,
} as TextStyle;

export function getRoleText(vsmObject: vsmObject): PIXI.Text {
  const { role } = vsmObject;
  return new PIXI.Text(formatCanvasText(role ?? "", 16, true), roleTextStyle);
}
