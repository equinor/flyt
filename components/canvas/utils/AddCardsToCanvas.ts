import { Viewport } from "pixi-viewport";
import { recursiveTree } from "./recursiveTree";
import { RecursiveState } from "easy-peasy";
import { vsmProject } from "../../../interfaces/VsmProject";
import { assetFactory } from "./AssetFactory";

/**
 * Adds the project-cards to our canvas
 * @param viewport
 * @param project
 * @param userCanEdit
 * @param dispatch
 * @param setSelectedObject
 * @param vsmObjectMutation
 */
export function addCardsToCanvas(
  viewport: Viewport,
  project: RecursiveState<vsmProject>,
  userCanEdit: boolean,
  dispatch,
  setSelectedObject,
  vsmObjectMutation
): void {
  // Adding cards to canvas
  const tree = project;
  const root = tree.objects ? tree.objects[0] : null;
  if (!root) {
    const card = assetFactory(
      {
        vsmObjectID: 0,
        name: "ERROR: Project contains no root object",
      },
      setSelectedObject
    );
    viewport.addChild(card);
  } else {
    viewport.addChild(
      recursiveTree(
        root,
        0,
        userCanEdit,
        dispatch,
        setSelectedObject,
        vsmObjectMutation
      )
    );
  }
}
