import { Viewport } from "pixi-viewport";
import { GenericPostit } from "../entities/GenericPostit";
import { recursiveTree } from "./recursiveTree";
import { Dispatch, RecursiveState } from "easy-peasy";
import { vsmProject } from "../../../interfaces/VsmProject";
import { ProjectModel } from "store/store";

export function addCards(
  viewport: Viewport,
  project: RecursiveState<vsmProject>,
  userCanEdit: boolean,
  dispatch: Dispatch<ProjectModel>
): void {
  console.info("Adding cards to canvas", { project });
  const tree = project;
  const root = tree.objects ? tree.objects[0] : null;
  if (!root) {
    viewport.addChild(
      GenericPostit({
        header: "ERROR",
        content: "Project contains no root object",
        options: {
          color: 0xff1243,
        },
      })
    );
  } else {
    viewport.addChild(recursiveTree(root, 0, userCanEdit, dispatch));
  }
}
