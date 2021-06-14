import { Viewport } from "pixi-viewport";
import { recursiveTree } from "./recursiveTree";
import { Dispatch, RecursiveState } from "easy-peasy";
import { vsmProject } from "../../../interfaces/VsmProject";
import { ProjectModel } from "store/store";
import { assetFactory } from "./AssetFactory";

/**
 * Adds the project-cards to our canvas
 * @param viewport
 * @param project
 * @param userCanEdit
 * @param dispatch
 */
export function addCardsToCanvas(
  viewport: Viewport,
  project: RecursiveState<vsmProject>,
  userCanEdit: boolean,
  dispatch: Dispatch<ProjectModel>
): void {
  console.info("Adding cards to canvas", { project });
  const tree = project;
  const root = tree.objects ? tree.objects[0] : null;
  if (!root) {
    const card = assetFactory(
      {
        vsmObjectID: 0,
        name: "ERROR: Project contains no root object",
      },
      dispatch
    );
    viewport.addChild(card);
  } else {
    viewport.addChild(recursiveTree(root, 0, userCanEdit, dispatch));
  }
}
