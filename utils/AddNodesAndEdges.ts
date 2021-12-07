import { ChildObjectsEntity, Process } from "interfaces/generated";
import { vsmObjectTypes } from "types/vsmObjectTypes";
import { GraphNode, GraphEdge, choiceGroupTypes } from "./layoutEngine";
import { defaultNodeWidth, defaultNodeHeight } from "./createGraph";
import { calculateTaskSectionWidth } from "./calculateTaskSectionWidth";

/**
 * Adds nodes and edges to the graph
 * @param process Process to be added to the graph
 * @param graph Graph that is receiving the nodes and edges
 */
export function AddNodesAndEdges(
  process: Process,
  graph: { nodes: GraphNode[]; edges: GraphEdge[] }
): void {
  // Add the root node
  const rootNode = {
    id: process.objects[0].vsmProjectID,
    name: process.objects[0].name,
    // hidden: true,
    width: defaultNodeWidth,
    height: defaultNodeHeight,
    type: vsmObjectTypes.process,
    level: 0,
    choiceGroup: choiceGroupTypes.Center,
    tasks: [],
    selected: false,
    children: process.objects[0].childObjects.map(
      (child: ChildObjectsEntity) => child.vsmObjectID
    ),
  };
  graph.nodes.push(rootNode);

  // And the children nodes (level 1)
  process.objects[0].childObjects.forEach((child) => {
    const childNode = {
      id: child.vsmObjectID,
      name: child.name,
      width: defaultNodeWidth,
      height: defaultNodeHeight,
      type: child.vsmObjectType.pkObjectType,
      tasks: child.tasks,
      level: 1,
      choiceGroup: choiceGroupTypes.Center,
      selected: false,
      children: child.childObjects.map(
        (child: ChildObjectsEntity) => child.vsmObjectID
      ),
    };
    graph.nodes.push(childNode);

    // add the edges
    graph.edges.push({
      from: process.vsmProjectID,
      to: child.vsmObjectID,
      // hidden: true,
    });

    // Then add the children of the children (level 2++)
    // Note, they should be added horizontally, unless they are choice nodes
    // That means, the siblings should have edges from the oldest to the youngest
    // Which is different from what the JSON from the api returns
    traverseAndAdd(child);

    /**
     * Traverse the child objects and add them to the graph
     * @param child the child object to add
     * @param level
     */
    function traverseAndAdd(child: ChildObjectsEntity, level = 2) {
      //If it is a choice node we need to group the children by their left or right position
      if (child.vsmObjectType.pkObjectType === vsmObjectTypes.choice) {
        // all children of the choice node are grouped by their left or right position
        const leftObjects = child.childObjects.filter(
          (choiceChild) => choiceChild?.choiceGroup === "Left"
        );
        const rightObjects = child.childObjects.filter(
          (choiceChild) => choiceChild?.choiceGroup === "Right"
        );
        // objects that are not grouped by their left or right position
        // const ungroupedObjects = child.childObjects.filter(
        //   (choiceChild) =>
        //     choiceChild?.choiceGroup !== "Left" &&
        //     choiceChild?.choiceGroup !== "Right"
        // );

        // console.log({ child, leftObjects, rightObjects, ungroupedObjects });
        // add the left children
        leftObjects.forEach((leftChild, index) => {
          // const leftChild = leftObjects[0];
          if (leftChild) {
            const leftChildNode = {
              id: leftChild.vsmObjectID,
              name: leftChild.name,
              width: defaultNodeWidth,
              height: defaultNodeHeight,
              level: level,
              type: leftChild.vsmObjectType.pkObjectType,
              tasks: leftChild.tasks,
              choiceGroup: choiceGroupTypes.Left,
              selected: false,
              children: leftChild.childObjects.map(
                (child: ChildObjectsEntity) => child.vsmObjectID
              ),
            };
            graph.nodes.push(leftChildNode);
            if (index === 0) {
              // if it is the first child, we need to add an edge from the choice node to the first child
              graph.edges.push({
                from: child.vsmObjectID,
                to: leftChild.vsmObjectID,
                label: "Yes",
              });
            } else {
              // if it is not the first child, we need to add an edge from the previous child to the current child
              graph.edges.push({
                from: leftObjects[index - 1].vsmObjectID,
                to: leftChild.vsmObjectID,
              });
            }
          }
        });

        // add the right children
        rightObjects.forEach((rightChild, index) => {
          if (rightChild) {
            const rightChildNode = {
              id: rightChild.vsmObjectID,
              name: rightChild.name,
              level: level,
              width: defaultNodeWidth,
              height: defaultNodeHeight,
              type: rightChild.vsmObjectType.pkObjectType,
              tasks: rightChild.tasks,
              choiceGroup: choiceGroupTypes.Right,
              selected: false,
              children: rightChild.childObjects.map(
                (child: ChildObjectsEntity) => child.vsmObjectID
              ),
            };

            graph.nodes.push(rightChildNode);
            if (index === 0) {
              // if it is the first child, we need to add an edge from the choice node to the first child
              graph.edges.push({
                from: child.vsmObjectID,
                to: rightChild.vsmObjectID,
                label: "No",
              });
            } else {
              // add the edge from the previous right child to the current right child
              graph.edges.push({
                from: rightObjects[index - 1].vsmObjectID,
                to: rightChild.vsmObjectID,
              });
            }
          }
        });
      } else {
        child.childObjects.forEach((grandChild: ChildObjectsEntity, index) => {
          //Calculate the width of the node including the taskSection
          const taskSectionWidth = calculateTaskSectionWidth(grandChild);
          const grandChildNode = {
            id: grandChild.vsmObjectID,
            name: grandChild.name,
            width: defaultNodeWidth + taskSectionWidth,
            height:
              grandChild.vsmObjectType.pkObjectType === vsmObjectTypes.waiting
                ? 61
                : defaultNodeHeight,
            type: grandChild.vsmObjectType.pkObjectType,
            tasks: grandChild.tasks,
            level,
            choiceGroup: choiceGroupTypes.Center,
            selected: false,
            children: grandChild.childObjects.map(
              (child: ChildObjectsEntity) => child.vsmObjectID
            ),
          };
          graph.nodes.push(grandChildNode);

          //if it is the first grandChild, add an edge from the child to the grandChild
          if (index === 0) {
            graph.edges.push({
              from: child.vsmObjectID,
              to: grandChild.vsmObjectID,
            });
          } else {
            const selectedChild = child.childObjects[index - 1];
            if (
              selectedChild.vsmObjectType.pkObjectType === vsmObjectTypes.choice
            ) {
              // if the previous child is a choice node, we need to add an edge from the previous childrens leaf-nodes to the current child
              const leftLeafNodeIndex = selectedChild.childObjects
                .map((child) => `${child.choiceGroup}`)
                .lastIndexOf("Left");
              const rightLeafNodeIndex = selectedChild.childObjects
                .map((child) => `${child.choiceGroup}`)
                .lastIndexOf("Right");

              const leftLeafNode =
                selectedChild.childObjects[leftLeafNodeIndex];
              const rightLeafNode =
                selectedChild.childObjects[rightLeafNodeIndex];

              if (leftLeafNode) {
                //Only add an edge if the left leaf does not have a child
                if (leftLeafNode.childObjects.length === 0) {
                  graph.edges.push({
                    from: leftLeafNode.vsmObjectID,
                    to: grandChild.vsmObjectID,
                    // label: "leftleaf",
                  });
                } else {
                  //group left leaf children and right leaf children
                  const leftLeafChildren = leftLeafNode.childObjects.filter(
                    (child) => child.choiceGroup === "Left"
                  );
                  const rightLeafChildren = rightLeafNode.childObjects.filter(
                    (child) => child.choiceGroup === "Right"
                  );
                  const lastLeftLeafChild =
                    leftLeafChildren[leftLeafChildren.length - 1];
                  const lastRightLeafChild =
                    rightLeafChildren[rightLeafChildren.length - 1];
                  if (lastLeftLeafChild) {
                    graph.edges.push({
                      from: lastLeftLeafChild.vsmObjectID,
                      to: grandChild.vsmObjectID,
                      // label: "leftleaf",
                    });
                  }
                  if (lastRightLeafChild) {
                    graph.edges.push({
                      from: lastRightLeafChild.vsmObjectID,
                      to: grandChild.vsmObjectID,
                      // label: "rightleaf",
                    });
                  }
                }
              }
              if (rightLeafNode) {
                //Only add an edge if the right leaf does not have a child
                if (rightLeafNode.childObjects.length === 0) {
                  graph.edges.push({
                    from: rightLeafNode.vsmObjectID,
                    to: grandChild.vsmObjectID,
                    // label: "rightleaf",
                  });
                } else {
                  //group left leaf children and right leaf children
                  const leftLeafChildren = leftLeafNode.childObjects.filter(
                    (child) => child.vsmObjectID
                  );
                  const rightLeafChildren = rightLeafNode.childObjects.filter(
                    (child) => child.vsmObjectID
                  );
                  const lastLeftLeafChild =
                    leftLeafChildren[leftLeafChildren.length - 1];
                  const lastRightLeafChild =
                    rightLeafChildren[rightLeafChildren.length - 1];

                  if (lastLeftLeafChild) {
                    graph.edges.push({
                      from: lastLeftLeafChild.vsmObjectID,
                      to: grandChild.vsmObjectID,
                      // label: "leftleaf",
                    });
                  }
                  if (lastRightLeafChild) {
                    graph.edges.push({
                      from: lastRightLeafChild.vsmObjectID,
                      to: grandChild.vsmObjectID,
                      // label: "rightleaf",
                    });
                  }
                }
              }
            } else {
              //if it is not the first grandChild, add an edge from the previous grandChild to the current grandChild
              graph.edges.push({
                from: child.childObjects[index - 1].vsmObjectID,
                to: grandChild.vsmObjectID,
                // label: "Continue",
              });
            }
          }

          return grandChild;
        });
      }

      //If there are no grandchildren, we don't need to traverse further
      //but if there are grandchildren, we need to traverse them
      if (child.childObjects.length > 0) {
        child.childObjects.forEach((grandChild) => {
          traverseAndAdd(grandChild, level + 1);
        });
      }
    }
  });
}
