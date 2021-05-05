import * as PIXI from "pixi.js";
import { Application, Graphics } from "pixi.js";
import { vsmObjectTypes } from "../types/vsmObjectTypes";
import { draggable } from "./Draggable";
import { vsmObject } from "../interfaces/VsmObject";
import { Viewport } from "pixi-viewport";
import { vsmProject } from "../interfaces/VsmProject";

/**
 * Toolbox aka. Card-Palette.
 * @param app
 * @param viewport
 * @param dispatch
 * @param hoveredObject
 * @param project
 */
export function addToolBox(
  app: Application,
  viewport: Viewport,
  dispatch: {
    setSelectedObject: (arg0: vsmObject) => void;
    setHoveredObject: (arg0: vsmObject) => void;
    clearHoveredObject: () => void;
  },
  hoveredObject: vsmObject,
  project: vsmProject
) {
  console.log("adding toolbox");
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
  draggable(
    mainActivity,
    vsmObjectTypes.mainActivity,
    viewport,
    dispatch,
    hoveredObject,
    project
  );
  box.addChild(mainActivity);

  const subActivity = new Graphics();
  subActivity.beginFill(0xfdd835);
  subActivity.drawRoundedRect(0, 0, 22, 22, 2);
  subActivity.endFill();
  subActivity.x = mainActivity.x + padding;
  subActivity.y = rectangle.y + rectangle.height / 2 - subActivity.height / 2;
  draggable(
    subActivity,
    vsmObjectTypes.subActivity,
    viewport,
    dispatch,
    hoveredObject,
    project
  );
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
  draggable(
    choiceIcon,
    vsmObjectTypes.choice,
    viewport,
    dispatch,
    hoveredObject,
    project
  );
  box.addChild(choiceIcon);

  const waitingIcon = new Graphics();
  waitingIcon.beginFill(0xff8f00);
  waitingIcon.drawRoundedRect(0, 0, 22, 12, 2);
  waitingIcon.endFill();
  waitingIcon.x = choiceIcon.x - choiceIcon.width + padding;
  waitingIcon.y = rectangle.y + rectangle.height / 2 - waitingIcon.height / 2;
  draggable(
    waitingIcon,
    vsmObjectTypes.waiting,
    viewport,
    dispatch,
    hoveredObject,
    project
  );
  box.addChild(waitingIcon);

  app.stage?.addChild(box);
  box.y = window.innerHeight - 84 - box.height;
  box.x = window.innerWidth / 2 - box.width / 2; //Align center
  // box.x = 38; //If left aligned

  return () => {
    console.log("Cleanup toolbar", app.stage);
    app.stage?.removeChildren();
    console.log("toolbar released", app.stage);
  }; //Cleanup method
}
