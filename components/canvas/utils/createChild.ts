import { vsmObject } from "../../../interfaces/VsmObject";
import { assetFactory } from "./AssetFactory";
import { getViewPort } from "./PixiViewport";
import { moveExistingVsmObjectToHoveredCard } from "./moveCard";
import { vsmObjectTypes } from "../../../types/vsmObjectTypes";
import { pointerEvents } from "../../../types/PointerEvents";
import {
  clearHoveredObject,
  getDragObject,
  setDragObject,
} from "./hoveredObject";
import {
  getData,
  getDragging,
  removeObject,
  setData,
  setDragging,
} from "./cardDragState";
import { Dispatch } from "easy-peasy";
import { ProjectModel } from "store/store";

export function createChild(
  child: vsmObject,
  userCanEdit: boolean,
  dispatch?: Dispatch<ProjectModel>
) {
  // const card = vsmObjectFactory(
  //   child,
  //   () => dispatch.setSelectedObject(child),
  //   () => setHoveredObject(child),
  //   () => clearHoveredObject()
  // );

  const card = assetFactory(child, dispatch);

  const originalPosition = {
    x: card.position.x,
    y: card.position.y,
  };

  function onDragStart(event: { data: unknown }) {
    setDragObject(child);
    getViewPort().plugins.pause("drag");
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    setData(child.vsmObjectID, event.data);
    card.alpha = 0.5;
    setDragging(child.vsmObjectID, true);
  }

  function onDragEnd(dispatch) {
    //Todo: Fix bug where when dragging subactivity onto a mainactivity, the mainactivity is suddenly the child object... 🧐
    moveExistingVsmObjectToHoveredCard(getDragObject(), dispatch);

    card.alpha = 1;
    setDragging(child.vsmObjectID, false);
    //Move the card back to where it started
    card.x = originalPosition.x;
    card.y = originalPosition.y;
    // set the interaction data to null
    setData(child.vsmObjectID, null);
    getViewPort().plugins.resume("drag");
    clearHoveredObject();
    removeObject(child.vsmObjectID);
  }

  function onDragMove() {
    if (getDragging(child.vsmObjectID)) {
      const newPosition = getData(child.vsmObjectID).getLocalPosition(
        card.parent
      );
      card.x = newPosition.x + 20;
      card.y = newPosition.y + 20;
    }
  }

  card.interactive = true;
  const canDragCard: boolean =
    userCanEdit &&
    (child.vsmObjectType.pkObjectType === vsmObjectTypes.mainActivity ||
      child.vsmObjectType.pkObjectType === vsmObjectTypes.subActivity ||
      child.vsmObjectType.pkObjectType === vsmObjectTypes.choice ||
      child.vsmObjectType.pkObjectType === vsmObjectTypes.waiting);

  if (canDragCard) {
    card
      .on(pointerEvents.pointerover, () => {
        card.cursor = "pointer";
        card.alpha = 0.2;
      })
      .on(pointerEvents.pointerout, () => (card.alpha = 1))
      .on(pointerEvents.pointerdown, onDragStart)
      .on(pointerEvents.pointerup, () => onDragEnd(dispatch))
      .on(pointerEvents.pointerupoutside, () => onDragEnd(dispatch))
      .on(pointerEvents.pointermove, onDragMove);
  }

  return card;
}
