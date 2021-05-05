import { vsmObject } from "../../interfaces/VsmObject";
import { vsmObjectFactory } from "../../components/canvas/VsmObjectFactory";
import { vsmObjectTypes } from "../../types/vsmObjectTypes";
import { pointerEvents } from "../../components/VSMCanvas";

export function createChild(
  child: vsmObject,
  viewport: {
    plugins: { pause: (arg0: string) => void; resume: (arg0: string) => void };
  },
  onPress: () => void,
  onHoverEnter: () => void,
  onHoverExit: () => void
) {
  const card = vsmObjectFactory(child, onPress, onHoverEnter, onHoverExit);

  const originalPosition = {
    x: card.position.x,
    y: card.position.y,
  };

  function onDragStart(event) {
    //todo:
    // setDragObject(child);
    viewport.plugins.pause("drag");
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
  }

  function onDragEnd() {
    //Todo: Fix bug where when dragging subactivity onto a mainactivity, the mainactivity is suddenly the child object... 🧐
    // moveExistingVsmObjectToHoveredCard(dragObject);

    this.alpha = 1;
    this.dragging = false;
    //Move the card back to where it started
    this.x = originalPosition.x;
    this.y = originalPosition.y;
    // set the interaction data to null
    this.data = null;
    viewport.plugins.resume("drag");
    // todo:
    // clearHoveredObject();
  }

  function onDragMove() {
    if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.parent);
      this.x = newPosition.x + 20;
      this.y = newPosition.y + 20;
    }
  }

  card.interactive = true;
  const canDragCard: boolean =
    child.vsmObjectType.pkObjectType === vsmObjectTypes.mainActivity ||
    child.vsmObjectType.pkObjectType === vsmObjectTypes.subActivity ||
    child.vsmObjectType.pkObjectType === vsmObjectTypes.choice ||
    child.vsmObjectType.pkObjectType === vsmObjectTypes.waiting;
  if (canDragCard) {
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

  return card;
}
