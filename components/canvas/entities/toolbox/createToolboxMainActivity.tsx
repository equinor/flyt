import { vsmObjectTypes } from "../../../../types/vsmObjectTypes";
import { Actions, Dispatch, StateMapper } from "easy-peasy";
import { _Pick } from "ts-toolbelt/out/Object/Pick";
import { vsmProject } from "../../../../interfaces/VsmProject";
import { ProjectModel } from "../../../../store/store";
import * as PIXI from "pixi.js";
import { addNewVsmObjectToHoveredCard } from "../../utils/addNewVsmObjectToHoveredCard";
import { clearHoveredObject } from "../../utils/hoveredObject";

export function createToolboxMainActivity(
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
  const { toolboxMainActivity } = PIXI.Loader.shared.resources;

  const mainActivity = new PIXI.Sprite(toolboxMainActivity.texture);
  mainActivity.x = 16;
  mainActivity.y = 16;
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
  return mainActivity;
}
