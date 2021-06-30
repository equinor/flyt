import { vsmObject } from "../../../interfaces/VsmObject";
import { vsmObjectTypes } from "../../../types/vsmObjectTypes";
import { nodeIsInTree } from "../../NodeIsInTree";
import { getVsmTypeName } from "../../GetVsmTypeName";
import { getHoveredObject } from "./hoveredObject";

export function moveExistingVsmObjectToHoveredCard(
  child: vsmObject,
  dispatch?: {
    setSnackMessage: (arg0: string) => void;
    moveVSMObject: (arg0: {
      vsmProjectID: number;
      vsmObjectID: number;
      choiceGroup: "Left" | "Right";
      leftObjectId: number;
      parent: number;
    }) => void;
  }
) {
  if (!child) return;
  const { vsmObjectID, vsmProjectID } = child;
  const target = getHoveredObject();

  const childId = child?.vsmObjectID;
  const targetId = target?.vsmObjectID;

  //Todo: Improve target logic. Instead of using "movetoObject", do a collision detection etc
  //  Read up on hitTest -> https://pixijs.download/release/docs/PIXI.InteractionManager.html#hitTest
  if (!target) return;
  if (childId === targetId) {
    //Cannot drop on itself. 👆 - Hack to not trigger on single press
    return;
  }
  const { pkObjectType: hoveredType } = target.vsmObjectType;
  const dragType = child.vsmObjectType.pkObjectType;
  if (dragType === vsmObjectTypes.choice && nodeIsInTree(target, child)) {
    // VSM-80 Should not be able to drop a parent on a child item
    dispatch?.setSnackMessage(
      `🙅‍♀️ Cannot move a parent to a child-object -> Circular inheritance`
    );
    return;
  }
  if (dragType === vsmObjectTypes.mainActivity) {
    //Note: we can only drop a "mainActivity" on "input" or on another "mainActivity".
    //Parent should be the target's parent
    //LeftObject should be the target id
    if (
      hoveredType === vsmObjectTypes.input ||
      hoveredType === vsmObjectTypes.mainActivity
    ) {
      dispatch?.moveVSMObject({
        vsmProjectID,
        vsmObjectID,
        choiceGroup: target?.choiceGroup,
        leftObjectId: target?.vsmObjectID,
        parent: target?.parent,
      });
    } else {
      dispatch?.setSnackMessage(
        `Cannot move a Main-Activity to a ${target.vsmObjectType.name}`
      );
      return;
    }
  } else if (
    hoveredType === vsmObjectTypes.mainActivity ||
    hoveredType === vsmObjectTypes.subActivity ||
    hoveredType === vsmObjectTypes.waiting ||
    hoveredType === vsmObjectTypes.choice
  ) {
    //Note, All other types need to be dropped on a "mainActivity", "subActivity", "waiting", or a "choice".
    dispatch?.moveVSMObject({
      vsmProjectID,
      vsmObjectID,
      leftObjectId: target?.vsmObjectID,
      choiceGroup: target?.choiceGroup,
      parent:
        target?.vsmObjectType?.pkObjectType === vsmObjectTypes.mainActivity
          ? target?.vsmObjectID
          : target?.parent,
    });
  } else {
    dispatch?.setSnackMessage(
      `Cannot move a ${getVsmTypeName(dragType)} to a ${
        target.vsmObjectType.name
      }`
    );
    return;
  }
}
