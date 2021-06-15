import { vsmObjectTypes } from "../../../../types/vsmObjectTypes";
import { Actions, Dispatch, StateMapper } from "easy-peasy";
import { _Pick } from "ts-toolbelt/out/Object/Pick";
import { vsmProject } from "../../../../interfaces/VsmProject";
import { ProjectModel } from "../../../../store/store";
import * as PIXI from "pixi.js";
import { addNewVsmObjectToHoveredCard } from "../../utils/addNewVsmObjectToHoveredCard";
import { clearHoveredObject } from "../../utils/hoveredObject";

export function createToolboxWaiting(
  draggable: (
    card,
    vsmObjectType: vsmObjectTypes,
    addNewVsmObjectToHoveredCard,
    clearHoveredObject
  ) => void,
  project: StateMapper<
    _Pick<
      vsmProject,
      "lastUpdated" | "created" | "objects" | "name" | "vsmProjectID"
    >
  >,
  dispatch: Actions<ProjectModel> & Dispatch
) {
  const { toolboxWaiting } = PIXI.Loader.shared.resources;

  const waitingIcon = new PIXI.Sprite(toolboxWaiting.texture);
  waitingIcon.x = 130;
  waitingIcon.y = 21;

  draggable(
    waitingIcon,
    vsmObjectTypes.waiting,
    () =>
      addNewVsmObjectToHoveredCard(vsmObjectTypes.waiting, project, dispatch),
    clearHoveredObject
  );
  return waitingIcon;
}
