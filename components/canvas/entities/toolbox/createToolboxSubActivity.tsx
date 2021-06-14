import { vsmObjectTypes } from "../../../../types/vsmObjectTypes";
import { Actions, Dispatch, StateMapper } from "easy-peasy";
import { _Pick } from "ts-toolbelt/out/Object/Pick";
import { vsmProject } from "../../../../interfaces/VsmProject";
import { ProjectModel } from "../../../../store/store";
import * as PIXI from "pixi.js";
import { addNewVsmObjectToHoveredCard } from "../../utils/addNewVsmObjectToHoveredCard";
import { clearHoveredObject } from "../../utils/hoveredObject";

export function createToolboxSubActivity(
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
  const { toolboxSubActivity } = PIXI.Loader.shared.resources;

  const subActivity = new PIXI.Sprite(toolboxSubActivity.texture);
  subActivity.x = 54;
  subActivity.y = 16;
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
  return subActivity;
}
