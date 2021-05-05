import PIXI from "pixi.js";
import { vsmObjectTypes } from "../types/vsmObjectTypes";
import { vsmObject } from "../interfaces/VsmObject";
import { pointerEvents } from "./VSMCanvas";
import { getVsmTypeName } from "./GetVsmTypeName";
import { vsmProject } from "../interfaces/VsmProject";
import { Viewport } from "pixi-viewport";

function addNewVsmObjectToHoveredCard(
  dragType: vsmObjectTypes,
  hoveredObject,
  project,
  dispatch
) {
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

export function draggable(
  card: PIXI.Graphics,
  vsmObjectType: vsmObjectTypes,
  viewport: Viewport,
  dispatch: {
    setSelectedObject: (arg0: vsmObject) => void;
    setHoveredObject: (arg0: vsmObject) => void;
    clearHoveredObject: () => void;
  },
  hoveredObject: vsmObject,
  project: vsmProject
) {
  const originalPosition = {
    x: card.position.x,
    y: card.position.y,
  };

  function onDragStart(event) {
    viewport.plugins.pause("drag");
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
  }

  function onDragEnd() {
    console.log({ vsmObjectType, hoveredObject, project, dispatch });
    addNewVsmObjectToHoveredCard(
      vsmObjectType,
      hoveredObject,
      project,
      dispatch
    );
    this.alpha = 1;
    this.dragging = false;
    //Move the card back to where it started
    this.x = originalPosition.x;
    this.y = originalPosition.y;
    // set the interaction data to null
    this.data = null;
    viewport.plugins.resume("drag");
    dispatch.clearHoveredObject();
  }

  function onDragMove() {
    if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.parent);
      if (vsmObjectType === vsmObjectTypes.choice) {
        this.x = newPosition.x + 18; // move it slightly away from the pointer, since hoverEvent is not triggered if object is between cursor and target
        this.y = newPosition.y + 18;
      } else {
        this.x = newPosition.x + 6;
        this.y = newPosition.y + 6;
      }
    }
  }

  card.interactive = true;
  card
    .on(pointerEvents.pointerover, () => {
      card.cursor = "pointer";
      card.alpha = 0.2;
    })
    .on(pointerEvents.pointerout, () => (card.alpha = 1))
    .on(pointerEvents.pointerdown, onDragStart)
    .on(pointerEvents.pointerup, onDragEnd)
    .on(pointerEvents.pointerupoutside, onDragEnd)
    .on(pointerEvents.pointermove, onDragMove);
}
