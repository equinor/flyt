import { vsmObjectTypes } from "../../../../types/vsmObjectTypes";
import { Actions, Dispatch, StateMapper } from "easy-peasy";
import { _Pick } from "ts-toolbelt/out/Object/Pick";
import { vsmProject } from "../../../../interfaces/VsmProject";
import { ProjectModel } from "../../../../store/store";
import * as PIXI from "pixi.js";
import { addNewVsmObjectToHoveredCard } from "../../utils/addNewVsmObjectToHoveredCard";
import { clearHoveredObject } from "../../utils/hoveredObject";
import { vsmObject } from "interfaces/VsmObject";
import { UseMutationResult } from "react-query";

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
      "updated" | "created" | "objects" | "name" | "vsmProjectID"
    >
  >,
  vsmObjectAddMutation: UseMutationResult<unknown, unknown, vsmObject, unknown>,
  dispatch: Actions<ProjectModel> & Dispatch
): PIXI.Container {
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
        vsmObjectAddMutation,
        dispatch
      ),
    clearHoveredObject
  );
  return subActivity;
}
