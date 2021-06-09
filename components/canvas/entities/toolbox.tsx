import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import { vsmObjectTypes } from "../../../types/vsmObjectTypes";
import { addNewVsmObjectToHoveredCard } from "../utils/addNewVsmObjectToHoveredCard";
import { clearHoveredObject } from "../utils/hoveredObject";
import { getApp } from "../utils/app";
import { ActionTypes, Dispatch, StateMapper } from "easy-peasy";
import { vsmProject } from "interfaces/VsmProject";
import { ProjectModel } from "store/store";
import { _FilterKeys } from "ts-toolbelt/out/Object/FilterKeys";
import { _Pick } from "ts-toolbelt/out/Object/Pick";

//Todo: Convert assets to png sprites (Small performance improvement)
export const addToolBox = (
  draggable: (
    card: PIXI.Graphics,
    vsmObjectType: vsmObjectTypes,
    addNewVsmObjectToHoveredCard,
    clearHoveredObject
  ) => void,
  project: StateMapper<
    _Pick<vsmProject, _FilterKeys<vsmProject, ActionTypes, "default">>
  >,
  dispatch: Dispatch<ProjectModel>
) => {
  const app = getApp();
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
    () =>
      addNewVsmObjectToHoveredCard(
        vsmObjectTypes.mainActivity,
        project,
        dispatch
      ),
    clearHoveredObject
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
    () =>
      addNewVsmObjectToHoveredCard(
        vsmObjectTypes.subActivity,
        project,
        dispatch
      ),
    clearHoveredObject
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
    () =>
      addNewVsmObjectToHoveredCard(vsmObjectTypes.choice, project, dispatch),
    clearHoveredObject
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
    () =>
      addNewVsmObjectToHoveredCard(vsmObjectTypes.waiting, project, dispatch),
    clearHoveredObject
  );
  box.addChild(waitingIcon);

  app.stage.addChild(box);
  box.y = window.innerHeight - box.height - 100;
  if (window.innerWidth < 768) {
    box.x = window.innerWidth / 2 - box.width / 2;
  } else {
    box.x = 56;
  }

  return () => app.stage.removeChild(box); //Cleanup method
};
