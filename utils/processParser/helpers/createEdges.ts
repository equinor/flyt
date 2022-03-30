import { vsmObject } from "../../../interfaces/VsmObject";
import { GraphEdge } from "../../layoutEngine";
import { vsmObjectTypes } from "../../../types/vsmObjectTypes";

function destructureChoiceObject(object: vsmObject) {
  if (object.vsmObjectType.pkObjectType !== vsmObjectTypes.choice) {
    throw new Error("Object is not a choice");
  }
  const leftChildren = object.childObjects.filter(
    (child) => child.choiceGroup === "Left"
  );
  const rightChildren = object.childObjects.filter(
    (child) => child.choiceGroup === "Right"
  );

  const lastLeftChild = leftChildren[leftChildren.length - 1];
  const lastRightChild = rightChildren[rightChildren.length - 1];
  return { leftChildren, rightChildren, lastLeftChild, lastRightChild };
}

/**
 * Creates edges for the graph.
 */
export function createEdges(
  objects: vsmObject[],
  parent?: vsmObject
): GraphEdge[] {
  if (!objects) return [];
  const edges: GraphEdge[] = [];
  objects.forEach((object) => {
    /////// START CHOICE LOGIC //////////////////////
    /////////////////// Current Object is Choice Logic ///////////////////////
    const isChoice =
      object.vsmObjectType.pkObjectType === vsmObjectTypes.choice;
    if (isChoice) {
      edges.push(...createEdges(object.childObjects, object));
      return edges;
    }
    ///// Child is choice logic //////////////////////
    // If a child object is a choice, we want to create an edge from the last child to the next object after it.
    const childChoiceObjects = object.childObjects.filter(
      (child) => child.vsmObjectType.pkObjectType === vsmObjectTypes.choice
    );
    childChoiceObjects?.forEach((choice) => {
      const { lastLeftChild, lastRightChild } = destructureChoiceObject(choice);
      const vsmObject =
        object.childObjects[object.childObjects.indexOf(choice) + 1];
      if (vsmObject) {
        if (lastLeftChild) {
          edges.push({
            from: lastLeftChild.vsmObjectID,
            to: vsmObject.vsmObjectID,
          });
        }
        if (lastRightChild) {
          edges.push({
            from: lastRightChild.vsmObjectID,
            to: vsmObject.vsmObjectID,
          });
        }
      }
    });
    /////// END CHOICE LOGIC //////////////////////
    if (parent) {
      // Create edge from parent to current object
      edges.push({ from: parent.vsmObjectID, to: object.vsmObjectID });

      object.childObjects.forEach((child, index, array) => {
        if (index === 0) {
          edges.push({ from: object.vsmObjectID, to: child.vsmObjectID });
        } else {
          const previousChild = array[index - 1];
          edges.push({
            from: previousChild.vsmObjectID,
            to: child.vsmObjectID,
          });
        }
        if (child.childObjects) edges.push(...createEdges([child]));
      });
    } else {
      edges.push(...createEdges(object.childObjects, object));
    }
  });

  return edges;
}
