import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { Application, Container, Graphics } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { isMobile } from "react-device-detect";
import { vsmObjectFactory } from "./canvas/VsmObjectFactory";
import { useStoreDispatch, useStoreState } from "../hooks/storeHooks";
import { debounce } from "../utils/debounce";
import { vsmObject } from "../interfaces/VsmObject";
import { VSMSideBar } from "./VSMSideBar";
import { GenericPostit } from "./canvas/GenericPostit";
import { vsmObjectTypes } from "../types/vsmObjectTypes";
import style from "./VSMCanvas.module.scss";
import { getVsmTypeName } from "./GetVsmTypeName";
import { DeleteVsmObjectDialog } from "./DeleteVsmObjectDialog";
import { useAccount, useMsal } from "@azure/msal-react";
import { getUserCanEdit } from "./GetUserCanEdit";
import { nodeIsInTree } from "./NodeIsInTree";

const app: Application = new Application({
  // resizeTo: window,
  height: window.innerHeight - 70,
  width: window.innerWidth,
  backgroundColor: 0xf7f7f7,
  antialias: true,
});

const viewport: Viewport = new Viewport({
  interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
});

function initCanvas(ref: React.MutableRefObject<HTMLDivElement>) {
  // Make sure the app.stage is empty
  app.stage.removeChildren();
  // add the viewport to the stage
  app.stage.addChild(viewport);

  if (isMobile) {
    viewport
      .drag()
      .pinch() // This doesn't work that well on desktop.
      .wheel()
      .decelerate({ friction: 0.4 });
  } else viewport.drag().wheel().decelerate({ friction: 0.4 });

  // Add app to DOM
  ref.current.appendChild(app.view);

  app?.start();

  console.info("Initialized canvas");
}

function getViewPort() {
  return viewport;
}

function cleanupApp() {
  // Todo: Fix cleanup of app
  // console.info("Cleaning up app", { app, viewport });
  app.stage.removeChildren(); // Just to be sure, remove the current stage children ( memory leak...)
  app?.stop();
  // On unload completely destroy the application and all of it's children
  // app?.destroy(true, { children: true });
}

export const pointerEvents = {
  pointerdown: "pointerdown",
  pointerup: "pointerup",
  pointerupoutside: "pointerupoutside",
  pointermove: "pointermove",
  pointerover: "pointerover",
  pointerout: "pointerout",
  click: "click", // Fired when a pointer device button (usually a mouse left-button) is pressed and released on the display object. DisplayObject's interactive property must be set to true to fire event.
};

function addToolBox(
  draggable: (card: PIXI.Graphics, vsmObjectType: vsmObjectTypes) => void
) {
  const box = new PIXI.Container();

  const padding = 40;
  //  Render the drag'n-drop-box
  const rectangle = new Graphics();
  const width = padding * 4;
  const height = 54;
  rectangle.beginFill(0xffffff);
  rectangle.drawRoundedRect(0, 0, width, height, 6);
  rectangle.endFill();

  const rectangleBorder = new Graphics();
  rectangleBorder.beginFill(0xd6d6d6);
  rectangleBorder.drawRoundedRect(0, 0, width + 1, height + 1, 6);
  rectangleBorder.endFill();
  rectangle.x = 0.5;
  rectangle.y = 0.5;
  box.addChild(rectangleBorder);

  box.addChild(rectangle);

  // Render the icons
  const mainActivity = new Graphics();
  mainActivity.beginFill(0x52c0ff);
  mainActivity.drawRoundedRect(0, 0, 22, 22, 2);
  mainActivity.endFill();
  mainActivity.x = 14;
  mainActivity.y = rectangle.y + rectangle.height / 2 - mainActivity.height / 2;
  draggable(mainActivity, vsmObjectTypes.mainActivity);
  box.addChild(mainActivity);

  const subActivity = new Graphics();
  subActivity.beginFill(0xfdd835);
  subActivity.drawRoundedRect(0, 0, 22, 22, 2);
  subActivity.endFill();
  subActivity.x = mainActivity.x + padding;
  subActivity.y = rectangle.y + rectangle.height / 2 - subActivity.height / 2;
  draggable(subActivity, vsmObjectTypes.subActivity);
  box.addChild(subActivity);

  const choiceIcon = new Graphics();
  choiceIcon.beginFill(0xfdd835);
  const hypotenuse = 22;
  const edge = Math.sqrt(hypotenuse ** 2 / 2);
  choiceIcon.drawRoundedRect(0, 0, edge, edge, 2);
  choiceIcon.pivot.x = choiceIcon.width / 2;
  choiceIcon.pivot.y = choiceIcon.height / 2;

  choiceIcon.y =
    rectangle.y +
    rectangle.height / 2 -
    choiceIcon.height / 2 +
    choiceIcon.height / 2;
  choiceIcon.x = subActivity.x + padding + choiceIcon.width / 2;
  choiceIcon.angle = 45;
  draggable(choiceIcon, vsmObjectTypes.choice);
  box.addChild(choiceIcon);

  const waitingIcon = new Graphics();
  waitingIcon.beginFill(0xff8f00);
  waitingIcon.drawRoundedRect(0, 0, 22, 12, 2);
  waitingIcon.endFill();
  waitingIcon.x = choiceIcon.x - choiceIcon.width + padding;
  waitingIcon.y = rectangle.y + rectangle.height / 2 - waitingIcon.height / 2;
  draggable(waitingIcon, vsmObjectTypes.waiting);
  box.addChild(waitingIcon);

  app.stage.addChild(box);
  box.y = window.innerHeight - box.height - 100;
  if (window.innerWidth < 768) {
    box.x = window.innerWidth / 2 - box.width / 2;
  } else {
    box.x = 56;
  }

  return () => app.stage.removeChild(box); //Cleanup method
}

let hoveredObject: vsmObject | null = null;
let dragObject: vsmObject | null = null;

export default function VSMCanvas(): JSX.Element {
  const ref = useRef(document.createElement("div"));
  const selectedObject = useStoreState((state) => state.selectedObject);
  const dispatch = useStoreDispatch();
  const project = useStoreState((state) => state.project);

  const [visibleDeleteScrim, setVisibleDeleteScrim] = React.useState(false);

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const userCanEdit = getUserCanEdit(account, project);

  function setHoveredObject(vsmObject: vsmObject) {
    if (vsmObject !== dragObject) {
      console.log(
        "set hovered object",
        getVsmTypeName(vsmObject.vsmObjectType.pkObjectType),
        vsmObject.vsmObjectID
      );
      hoveredObject = vsmObject;
    }
  }

  const clearHoveredObject = () => {
    hoveredObject = null;
  };

  function setDragObject(vsmObject: vsmObject) {
    dragObject = vsmObject;
  }

  function addNewVsmObjectToHoveredCard(dragType: vsmObjectTypes) {
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

  function moveExistingVsmObjectToHoveredCard(child: vsmObject) {
    if (!child) return;
    const { vsmObjectID, vsmProjectID } = child;
    const target = hoveredObject;

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
      dispatch.setSnackMessage(
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
        dispatch.moveVSMObject({
          vsmProjectID,
          vsmObjectID,
          choiceGroup: target?.choiceGroup,
          leftObjectId: target?.vsmObjectID,
          parent: target?.parent,
        });
      } else {
        dispatch.setSnackMessage(
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
      dispatch.moveVSMObject({
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
      dispatch.setSnackMessage(
        `Cannot move a ${getVsmTypeName(dragType)} to a ${
          target.vsmObjectType.name
        }`
      );
      return;
    }
  }

  function draggable(card: PIXI.Graphics, vsmObjectType: vsmObjectTypes) {
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
      addNewVsmObjectToHoveredCard(vsmObjectType);
      this.alpha = 1;
      this.dragging = false;
      //Move the card back to where it started
      this.x = originalPosition.x;
      this.y = originalPosition.y;
      // set the interaction data to null
      this.data = null;
      viewport.plugins.resume("drag");
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

  // "Constructor"
  useEffect(() => {
    initCanvas(ref);
    return () => cleanupApp();
  }, []);

  // "Renderer"
  useEffect(() => {
    if (project) {
      const viewport = getViewPort();
      addCards(viewport);

      return () => {
        console.info("Clearing canvas");
        viewport.removeChildren();
      };
    }
  }, [project]);

  useEffect(() => {
    if (userCanEdit) {
      return addToolBox(draggable);
    } else {
      return () => {
        //nothing to clean up
      };
    }
  }, [project]);

  function createChild(child: vsmObject) {
    const card = vsmObjectFactory(
      child,
      () => dispatch.setSelectedObject(child),
      () => setHoveredObject(child),
      () => clearHoveredObject()
    );

    const originalPosition = {
      x: card.position.x,
      y: card.position.y,
    };

    function onDragStart(event) {
      setDragObject(child);
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
      moveExistingVsmObjectToHoveredCard(dragObject);

      this.alpha = 1;
      this.dragging = false;
      //Move the card back to where it started
      this.x = originalPosition.x;
      this.y = originalPosition.y;
      // set the interaction data to null
      this.data = null;
      viewport.plugins.resume("drag");
      clearHoveredObject();
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
        .on(pointerEvents.pointerup, onDragEnd)
        .on(pointerEvents.pointerupoutside, onDragEnd)
        .on(pointerEvents.pointermove, onDragMove);
    }

    return card;
  }

  function recursiveTree(root: vsmObject, level = 0): Container {
    // Level 0 contains the root-node and we don't display it.
    // Level 1 should be rendered horizontal.
    // Level > 1 should be rendered vertical

    if (level === 0) {
      // Create a container for all our cards
      const container = new PIXI.Container();

      // Remember, we don't display the root node...
      // so let's start laying out our horizontal first row
      root.childObjects?.forEach((child) => {
        const c = recursiveTree(child, level + 1);
        const rectangle = new Graphics()
          // .beginFill(0xcacaca) //<- Comment out for debugging
          .drawRect(0, 0, c.width, c.height);
        const wrapper = new PIXI.Container();
        wrapper.addChild(rectangle, c);
        c.x = c.width / 2;
        container.addChild(wrapper);
      });
      // Adjust Layout
      let last = null;
      container.children.forEach((child) => {
        if (last) child.x = last.x + last.width + 10;
        last = child;
      });

      container.x = 126;
      container.y = 60;
      // Exit, Returning the container with all our cards
      return container;
    }

    // Vertical placement for levels > 1
    const containerGroup = new PIXI.Container();
    containerGroup.addChild(createChild(root));

    const container = new PIXI.Container();
    let nextY = containerGroup.height + 20; // Generic element y position
    let nextLeftY = nextY; // Left choiceGroup element y position
    let nextRightY = nextY; // Right choiceGroup element y position

    root.childObjects?.forEach((child) => {
      const c = recursiveTree(child, level + 1);
      c.y = nextY;
      nextY = nextY + c.height + 20;
      const tempChild = createChild(child);
      if (child.choiceGroup === "Left") {
        c.pivot.set(tempChild.width, 0);
        c.x = 126 / 2 - 10;
        c.y = nextLeftY;
        nextLeftY = nextLeftY + c.height + 20;
      }
      if (child.choiceGroup === "Right") {
        c.pivot.set(0 / 2, 0);
        c.x = 126 / 2 + 10;
        c.y = nextRightY;
        nextRightY = nextRightY + c.height + 20;
      }
      container.addChild(c);
    });
    containerGroup.addChild(container);
    return containerGroup;
  }

  function addCards(viewport: Viewport) {
    console.info("Adding cards to canvas", { project });
    const tree = project;
    const root = tree.objects ? tree.objects[0] : null;
    if (!root) {
      viewport.addChild(
        GenericPostit({
          header: "ERROR",
          content: "Project contains no root object",
          options: {
            color: 0xff1243,
          },
        })
      );
    } else {
      viewport.addChild(recursiveTree(root));
    }
  }

  function onChangeNameHandler() {
    return (event: { target: { value: string } }) => {
      const name = event.target.value;
      dispatch.setSelectedObject({ ...selectedObject, name });
      debounce(
        () => {
          dispatch.updateVSMObject({ ...selectedObject, name } as vsmObject);
        },
        1000,
        "Canvas-UpdateName"
      )();
    };
  }

  function onChangeRoleHandler() {
    return (event) => {
      const role = event.target.value;
      dispatch.setSelectedObject({ ...selectedObject, role });
      debounce(
        () => {
          dispatch.updateVSMObject({ ...selectedObject, role } as vsmObject);
        },
        1000,
        "Canvas-UpdateRole"
      )();
    };
  }

  function onChangeTimeHandler() {
    return (event) => {
      let time = parseInt(event.target.value);
      if (time < 0) time = 0;
      dispatch.setSelectedObject({ ...selectedObject, time });
      debounce(
        () => {
          dispatch.updateVSMObject({ ...selectedObject, time } as vsmObject);
        },
        1000,
        "Canvas-UpdateTime"
      )();
    };
  }

  function onChangeTimeDefinitionHandler() {
    return (timeDefinition: string) => {
      dispatch.setSelectedObject({ ...selectedObject, timeDefinition });
      debounce(
        () => {
          dispatch.updateVSMObject({
            ...selectedObject,
            timeDefinition,
          } as vsmObject);
        },
        1000,
        "Canvas-UpdateTimeDefinition"
      )();
    };
  }

  return (
    <>
      {visibleDeleteScrim && (
        <DeleteVsmObjectDialog
          objectToDelete={selectedObject}
          onClose={() => setVisibleDeleteScrim(false)}
        />
      )}

      <VSMSideBar
        onClose={() => dispatch.setSelectedObject(null)}
        onChangeName={onChangeNameHandler()}
        onChangeRole={onChangeRoleHandler()}
        onChangeTime={onChangeTimeHandler()}
        onChangeTimeDefinition={onChangeTimeDefinitionHandler()}
        onDelete={() => setVisibleDeleteScrim(true)}
        onAddTask={(task) => dispatch.addTask(task)}
        canEdit={userCanEdit}
      />
      <div className={style.canvasWrapper} ref={ref} />
    </>
  );
}
