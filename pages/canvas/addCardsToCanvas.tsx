import { RecursiveState } from "easy-peasy";
import { vsmProject } from "../../interfaces/VsmProject";
import { Viewport } from "pixi-viewport";
import { GenericPostit } from "../../components/canvas/GenericPostit";
import { recursiveTree } from "./recursiveTree";
import { vsmObject } from "../../interfaces/VsmObject";

/**
 * Add cards to viewport
 * @param project
 * @param viewport
 * @param dispatch
 */
export function addCardsToCanvas(
  project: RecursiveState<vsmProject>,
  viewport: Viewport,
  dispatch: {
    setSelectedObject: (arg0: vsmObject) => void;
    setHoveredObject: (arg0: vsmObject) => void;
    clearHoveredObject: () => void;
  }
): () => void {
  console.info("Adding cards to canvas", { project });
  const tree = project;
  const root = tree?.objects ? tree.objects[0] : null;
  if (!root) {
    viewport?.addChild(
      GenericPostit({
        header: "ERROR",
        content: "Project contains no root object",
        options: {
          color: 0xff1243,
        },
      })
    );
  } else {
    viewport.addChild(
      recursiveTree(
        root,
        0,
        viewport, //Todo: Check if these work...
        dispatch.setSelectedObject,
        dispatch.setHoveredObject,
        dispatch.clearHoveredObject
      )
    );
  }
  return () => {
    console.log("cleanup cards: Before", { viewport }, viewport.children);
    viewport?.removeChildren();
    console.log("cleanup cards: After", viewport.children);
  };
}
