import * as PIXI from "pixi.js";
import { vsmObjectTypes } from "../../types/vsmObjectTypes";
import { GenericPostit } from "./GenericPostit";
import MainActivity from "./entities/MainActivity";
import SubActivity from "./entities/SubActivity";
import Waiting from "./entities/Waiting";
import { vsmObject } from "../../interfaces/VsmObject";
import Choice from "./entities/Choice";

export function vsmObjectFactory(
  o: vsmObject,
  onPress: () => void,
  onHoverEnter: () => void,
  onHoverExit: () => void
): PIXI.DisplayObject {
  const { pkObjectType, name } = o.vsmObjectType;
  switch (pkObjectType) {
    case vsmObjectTypes.text:
      return GenericPostit({
        header: name,
        hideTitle: !!o.name,
        content: o.name,
        options: {
          color: 0xc4e1e3,
        },
        onPress: () => onPress(),
        onHover: () => onHoverEnter(),
        onHoverExit: () => onHoverExit(),
      });
    case vsmObjectTypes.choice:
      return Choice({
        content: o.name,
        onPress: () => onPress(),
        onHover: () => onHoverEnter(),
        onHoverExit: () => onHoverExit(),
      });
    case vsmObjectTypes.process:
      return new PIXI.Container();
    case vsmObjectTypes.supplier:
    case vsmObjectTypes.input:
    case vsmObjectTypes.output:
    case vsmObjectTypes.customer:
      return GenericPostit({
        header: name,
        content: o.name,
        options: {
          color: 0x00d889,
        },
        onPress: () => onPress(),
        onHover: () => onHoverEnter(),
        onHoverExit: () => onHoverExit(),
      });
    case vsmObjectTypes.mainActivity:
      return MainActivity({
        text: o.name,
        onPress: () => onPress(),
        onHover: () => onHoverEnter(),
        onHoverExit: () => onHoverExit(),
      });
    case vsmObjectTypes.subActivity:
      return SubActivity({
        text: o.name,
        role: o.role || "Role?",
        time:
          !!o.time && o.time !== 0
            ? o.time === 1
              ? `1 Minute`
              : `${o.time} Minutes`
            : "Duration?",
        onPress: () => onPress(),
        onHover: () => onHoverEnter(),
        onHoverExit: () => onHoverExit(),
      });
    case vsmObjectTypes.waiting:
      return Waiting(
        !!o.time && o.time !== 0
          ? o.time === 1
            ? `1 Minute`
            : `${o.time} Minutes`
          : "?",
        () => onPress(),
        () => onHoverEnter(),
        () => onHoverExit()
      );
    default:
      return GenericPostit({
        header: "ERROR",
        content: "Could not find matching object type",
        options: {
          color: 0xff1243,
        },
      });
  }
}
