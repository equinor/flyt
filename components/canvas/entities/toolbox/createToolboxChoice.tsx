import { vsmObjectTypes } from "../../../../types/vsmObjectTypes";
import { Actions, Dispatch, StateMapper } from "easy-peasy";
import { _Pick } from "ts-toolbelt/out/Object/Pick";
import { vsmProject } from "../../../../interfaces/VsmProject";
import { ProjectModel } from "../../../../store/store";
import * as PIXI from "pixi.js";
import { addNewVsmObjectToHoveredCard } from "../../utils/addNewVsmObjectToHoveredCard";
import { clearHoveredObject } from "../../utils/hoveredObject";

export function createToolboxChoice(
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
  const { toolboxChoice } = PIXI.Loader.shared.resources;

  const choiceIcon = new PIXI.Sprite(toolboxChoice.texture);
  choiceIcon.x = 92;
  choiceIcon.y = 16;

  draggable(
    choiceIcon,
    vsmObjectTypes.choice,
    () =>
      addNewVsmObjectToHoveredCard(vsmObjectTypes.choice, project, dispatch),
    clearHoveredObject
  );
  return choiceIcon;
}
