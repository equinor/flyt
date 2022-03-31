import { vsmObjectTypes } from "../../../../types/vsmObjectTypes";
import { Actions, ActionTypes, Dispatch, StateMapper } from "easy-peasy";
import { _Pick } from "ts-toolbelt/out/Object/Pick";
import { vsmProject } from "../../../../interfaces/VsmProject";
import { ProjectModel } from "../../../../store/store";
import * as PIXI from "pixi.js";
import { addNewVsmObjectToHoveredCard } from "../../utils/addNewVsmObjectToHoveredCard";
import { clearHoveredObject } from "../../utils/hoveredObject";
import { vsmObject } from "interfaces/VsmObject";
import { UseMutationResult } from "react-query";
import { _FilterKeys } from "ts-toolbelt/out/Object/FilterKeys";
import { Process } from "../../../../interfaces/generated";
import { Container } from "pixi.js";

export function createToolboxMainActivity(
  draggable: (
    card,
    vsmObjectType: vsmObjectTypes,
    addNewVsmObjectToHoveredCard,
    clearHoveredObject
  ) => void,
  project: StateMapper<
    _Pick<vsmProject, _FilterKeys<Process, ActionTypes, "default">>
  >,
  vsmObjectAddMutation: UseMutationResult<unknown, unknown, vsmObject, unknown>,
  dispatch: Actions<ProjectModel> & Dispatch
): Container {
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
        vsmObjectAddMutation,
        dispatch
      ),
    clearHoveredObject
  );
  return mainActivity;
}
