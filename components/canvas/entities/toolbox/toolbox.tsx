import * as PIXI from "pixi.js";
import { vsmObjectTypes } from "../../../../types/vsmObjectTypes";
import { getApp } from "../../utils/PixiApp";
import { ActionTypes, Dispatch, StateMapper } from "easy-peasy";
import { vsmProject } from "interfaces/VsmProject";
import { ProjectModel } from "store/store";
import { _FilterKeys } from "ts-toolbelt/out/Object/FilterKeys";
import { _Pick } from "ts-toolbelt/out/Object/Pick";
import { createToolboxMainActivity } from "./createToolboxMainActivity";
import { createToolboxSubActivity } from "./createToolboxSubActivity";
import { createToolboxChoice } from "./createToolboxChoice";
import { createToolboxWaiting } from "./createToolboxWaiting";

const cache = { project: null, toolBox: null };
let box;

export const toolBox = (
  draggable: (
    card,
    vsmObjectType: vsmObjectTypes,
    addNewVsmObjectToHoveredCard,
    clearHoveredObject
  ) => void,
  project: StateMapper<
    _Pick<vsmProject, _FilterKeys<vsmProject, ActionTypes, "default">>
  >,
  dispatch: Dispatch<ProjectModel>
): (() => void) => {
  const app = getApp();
  if (box) app.stage.removeChild(box); // clean up old box
  box = new PIXI.Container();

  // We need to create a new toolbox if the project have changed since last time.
  // (since our "draggable"-method needs to know which project we are in...)
  // Todo: Could probably rewrite to lessen the amount of prop drilling in the project...
  if (cache.project == project.vsmProjectID) {
    app.stage.addChild(cache.toolBox);
  } else {
    //  Render the drag'n-drop-box
    const { toolbox } = PIXI.Loader.shared.resources;
    const rectangle = new PIXI.Sprite(toolbox.texture);

    // Render the icons
    const mainActivity = createToolboxMainActivity(
      draggable,
      project,
      dispatch
    );
    const subActivity = createToolboxSubActivity(draggable, project, dispatch);
    const choiceIcon = createToolboxChoice(draggable, project, dispatch);
    const waitingIcon = createToolboxWaiting(draggable, project, dispatch);

    box.addChild(rectangle, mainActivity, subActivity, choiceIcon, waitingIcon);
    app.stage.addChild(box);

    // Cache our box. No need to re-generate if we are on the same projectId
    cache.toolBox = box;
    cache.project = project.vsmProjectID;
  }

  // Adjust toolbar placement on different screen-sizes:
  const boxHeight = 54;
  const boxWidth = 168;

  // Always place at the Bottom of the screen
  box.y = window.innerHeight - boxHeight - 100;
  if (window.innerWidth >= 768) {
    // Place it to the left side if screen is > 768px.
    box.x = 56;
  } else {
    // Else -> center it
    box.x = window.innerWidth / 2 - boxWidth / 2;
  }

  return () => app.stage.removeChild(box); //Cleanup method
};
