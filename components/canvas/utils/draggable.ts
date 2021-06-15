import * as PIXI from "pixi.js";
import { vsmObjectTypes } from "../../../types/vsmObjectTypes";
import { getViewPort } from "./PixiViewport";
import { pointerEvents } from "../../../types/PointerEvents";

export function draggable(
  card: PIXI.Graphics,
  vsmObjectType: vsmObjectTypes,
  addNewVsmObjectToHoveredCard,
  clearHoveredObject
) {
  const originalPosition = {
    x: card.position.x,
    y: card.position.y,
  };

  function onDragStart(event) {
    getViewPort().plugins.pause("drag");
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
  }

  function onDragEnd() {
    addNewVsmObjectToHoveredCard(vsmObjectType);
    this.alpha = 1;
    this.dragging = false;
    //Move the card back to where it started
    this.x = originalPosition.x;
    this.y = originalPosition.y;
    // set the interaction data to null
    this.data = null;
    getViewPort().plugins.resume("drag");
    clearHoveredObject();
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
