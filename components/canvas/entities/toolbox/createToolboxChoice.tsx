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

export function createToolboxChoice(
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
  const { toolboxChoice } = PIXI.Loader.shared.resources;

  const choiceIcon = new PIXI.Sprite(toolboxChoice.texture);
  choiceIcon.x = 92;
  choiceIcon.y = 16;

  draggable(
    choiceIcon,
    vsmObjectTypes.choice,
    () =>
      addNewVsmObjectToHoveredCard(
        vsmObjectTypes.choice,
        project,
        vsmObjectAddMutation,
        dispatch
      ),
    clearHoveredObject
  );
  return choiceIcon;
}
