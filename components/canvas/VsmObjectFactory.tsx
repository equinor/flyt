import PIXI from "pixi.js";
import { vsmObjectTypes } from "../../types/vsmObjectTypes";
import { GenericPostit } from "./GenericPostit";
import MainActivity from "./entities/MainActivity";
import SubActivity from "./entities/SubActivity";
import Waiting from "./entities/Waiting";
import { vsmObject } from "../../interfaces/VsmObject";

export function vsmObjectFactory(
  o: vsmObject,
  onPress: () => void
): PIXI.DisplayObject {
  const { pkObjectType, name } = o.vsmObjectType;
  switch (pkObjectType) {
    case vsmObjectTypes.text:
      break;
    case vsmObjectTypes.choice:
      break;
    case vsmObjectTypes.process:
      return GenericPostit({
        header: name,
        hideTitle: !!o.name,
        content: o.name,
        options: {
          x: 0,
          y: 0,
          width: 126,
          height: 136,
          color: 0x00d889,
          scale: 1
        },
        onPress: () => onPress()
      });
    case vsmObjectTypes.supplier:
    case vsmObjectTypes.input:
    case vsmObjectTypes.output:
    case vsmObjectTypes.customer:
      return GenericPostit({
        header: name,
        content: o.name,
        options: {
          x: 0,
          y: 0,
          width: 126,
          height: 136,
          color: 0x00d889,
          scale: 1
        },
        onPress: () => onPress()
      });
    case vsmObjectTypes.mainActivity:
      return MainActivity({
        text: o.name,
        onPress: () => onPress()
      });
    case vsmObjectTypes.subActivity:
      return SubActivity({
        x: 0, y: 0, content: name,
        role: o.role || "Role?",
        time: !!o.time && o.time !== 0
          ? o.time === 1 ? `1 Minute` : `${o.time} Minutes`
          : "Duration?"
      });
    case vsmObjectTypes.waiting:
      return Waiting(
        !!o.time && o.time !== 0
          ? o.time === 1 ? `1 Minute` : `${o.time} Minutes`
          : "?"
        , () => onPress());
    default:
      return GenericPostit({
        header: "ERROR",
        content: "Could not find matching object type",
        options: {
          x: 0,
          y: 0,
          width: 126,
          height: 136,
          color: 0xff1243,
          scale: 1
        }
      });
  }
}
