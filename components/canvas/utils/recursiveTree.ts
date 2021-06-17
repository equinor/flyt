import { vsmObject } from "../../../interfaces/VsmObject";
import * as PIXI from "pixi.js";
import { Container, Graphics } from "pixi.js";
import { createChild } from "./createChild";
import { Dispatch } from "easy-peasy";
import { ProjectModel } from "../../../store/store";

export function recursiveTree(
  root: vsmObject,
  level = 0,
  userCanEdit: boolean,
  dispatch: Dispatch<ProjectModel>
): Container {
  // Level 0 contains the root-node and we don't display it.
  // Level 1 should be rendered horizontal.
  // Level > 1 should be rendered vertical

  if (level === 0) {
    // Create a container for all our cards
    const container = new PIXI.Container();

    // Remember, we don't display the root node...
    // so let's start laying out our horizontal first row
    root.childObjects?.forEach((child) => {
      const c = recursiveTree(child, level + 1, userCanEdit, dispatch);
      const rectangle = new Graphics()
        // .beginFill(0xcacaca) //<- Comment out for debugging
        .drawRect(0, 0, c.width, c.height);
      const wrapper = new PIXI.Container();
      wrapper.addChild(rectangle, c);
      c.x = c.width / 2;
      container.addChild(wrapper);
    });
    // Adjust Layout
    let last = null;
    container.children.forEach((child) => {
      if (last) child.x = last.x + last.width + 10;
      last = child;
    });

    container.x = 126;
    container.y = 60;
    // Exit, Returning the container with all our cards
    return container;
  }

  // Vertical placement for levels > 1
  const containerGroup = new PIXI.Container();
  containerGroup.addChild(createChild(root, userCanEdit, dispatch));

  const container = new PIXI.Container();
  let nextY = containerGroup.height + 20; // Generic element y position
  let nextLeftY = nextY; // Left choiceGroup element y position
  let nextRightY = nextY; // Right choiceGroup element y position

  root.childObjects?.forEach((child) => {
    const c = recursiveTree(child, level + 1, userCanEdit, dispatch);
    c.y = nextY;
    nextY = nextY + c.height + 20;
    const tempChild = createChild(child, userCanEdit, dispatch);
    if (child.choiceGroup === "Left") {
      c.pivot.set(tempChild.width, 0);
      c.x = 126 / 2 - 10;
      c.y = nextLeftY;
      nextLeftY = nextLeftY + c.height + 20;
    }
    if (child.choiceGroup === "Right") {
      c.pivot.set(0 / 2, 0);
      c.x = 126 / 2 + 10;
      c.y = nextRightY;
      nextRightY = nextRightY + c.height + 20;
    }
    container.addChild(c);
  });
  containerGroup.addChild(container);
  return containerGroup;
}
