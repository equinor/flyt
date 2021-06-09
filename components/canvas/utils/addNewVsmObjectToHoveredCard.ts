import { vsmObjectTypes } from "../../../types/vsmObjectTypes";
import { vsmObject } from "../../../interfaces/VsmObject";
import { getVsmTypeName } from "../../GetVsmTypeName";
import { getHoveredObject } from "./hoveredObject";

export function addNewVsmObjectToHoveredCard(
  dragType: vsmObjectTypes,
  project,
  dispatch
) {
  const hoveredObject = getHoveredObject();
  //Todo: Improve target logic. Instead of using "hoveredObject", do a collision detection etc
  //  Read up on hitTest -> https://pixijs.download/release/docs/PIXI.InteractionManager.html#hitTest
  if (!hoveredObject) return;

  const { pkObjectType } = hoveredObject.vsmObjectType;
  if (dragType === vsmObjectTypes.mainActivity) {
    //Note: we can only drop a "mainActivity" on "input" or on another "mainActivity".
    //Parent should be the hoverObject parent
    //LeftObject should be the hoverObject id
    if (
      pkObjectType === vsmObjectTypes.input ||
      pkObjectType === vsmObjectTypes.mainActivity
    ) {
      const mainActivityObject: vsmObject = {
        vsmProjectID: project.vsmProjectID,
        fkObjectType: dragType,
        leftObjectId: hoveredObject?.vsmObjectID,
        parent: hoveredObject.parent,
        childObjects: [],
      };
      dispatch.addObject(mainActivityObject);
    } else {
      dispatch.setSnackMessage(
        `Cannot add a Main-Activity to a ${hoveredObject.vsmObjectType.name}`
      );
    }
    return;
  }
  //Note, All other types need to be dropped on a "mainActivity", "subActivity", "waiting", or a "choice".
  if (
    pkObjectType !== vsmObjectTypes.mainActivity &&
    pkObjectType !== vsmObjectTypes.subActivity &&
    pkObjectType !== vsmObjectTypes.waiting &&
    pkObjectType !== vsmObjectTypes.choice
  ) {
    dispatch.setSnackMessage(
      `Cannot add a ${getVsmTypeName(dragType)} to a ${
        hoveredObject.vsmObjectType.name
      }`
    );
    return;
  }

  const genericTypeObject: vsmObject = {
    vsmProjectID: project.vsmProjectID,
    fkObjectType: dragType,
    leftObjectId: hoveredObject?.vsmObjectID,
    choiceGroup: hoveredObject.choiceGroup, // <- Should be in the same "lane" as the hoveredObject
    parent: getParent(),
    childObjects: [],
  };
  const choiceTypeObject: vsmObject = {
    vsmProjectID: project.vsmProjectID,
    fkObjectType: dragType,
    leftObjectId: hoveredObject?.vsmObjectID,
    choiceGroup: hoveredObject.choiceGroup, // <- Should be in the same "lane" as the hoveredObject
    parent: getParent(),
    childObjects: [
      {
        vsmProjectID: project.vsmProjectID,
        fkObjectType: vsmObjectTypes.subActivity,
        choiceGroup: "Left",
        childObjects: [],
      },
      {
        vsmProjectID: project.vsmProjectID,
        fkObjectType: vsmObjectTypes.subActivity,
        choiceGroup: "Right",
        childObjects: [],
      },
    ],
  };

  const newObject =
    dragType === vsmObjectTypes.choice ? choiceTypeObject : genericTypeObject;
  dispatch.addObject(newObject);

  function getParent() {
    const { pkObjectType } = hoveredObject.vsmObjectType;
    if (pkObjectType === vsmObjectTypes.mainActivity) {
      return hoveredObject.vsmObjectID;
    } else {
      return hoveredObject.parent;
    }
  }
}
