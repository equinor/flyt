import {
  ChildObjectsEntity,
  ChildObjectsEntity1,
  ChildObjectsEntity2,
  ChildObjectsEntity3,
  Process,
  TasksEntity,
} from "interfaces/generated";
import { vsmObjectTypes } from "types/vsmObjectTypes";

interface Node {
  type: vsmObjectTypes;
  id: number;
  name?: string;
  time?: { value: number; unit: string };
  role?: string;
  hidden?: boolean;
  tasks?: Array<TasksEntity>;
  position?: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  level: number;
}

interface Edge {
  from: number; //vsmObjectID
  to: number; //vsmObjectID
  position?: {
    start: {
      x: number;
      y: number;
    };
    end: {
      x: number;
      y: number;
    };
  };
  hidden?: boolean;
}

export class Graph {
  nodes: Array<Node>;
  edges: Array<Edge>;

  constructor(process: Process) {
    const graph = createGraph(process);
    this.nodes = graph.nodes;
    this.edges = graph.edges;
  }

  getNode(id: number): Node {
    const result = this.nodes.find((node) => node.id === id);
    if (!result) {
      throw new Error(`Node with id ${id} not found`);
    }
    return result;
  }

  getEdge(from: number, to: number): Edge {
    const result = this.edges.find(
      (edge) => edge.from === from && edge.to === to
    );
    if (!result) {
      throw new Error(`Edge from ${from} to ${to} not found`);
    }
    return result;
  }

  getMaxWidth(): number {
    return this.nodes.reduce(
      (max, node) => (node.position.x > max ? node.position.x : max),
      0
    );
  }
  getMaxHeight(): number {
    return this.nodes.reduce(
      (max, node) => (node.position.y > max ? node.position.y : max),
      0
    );
  }
}

// create a graph of nodes with edges
function createGraph(process: Process): {
  nodes: Array<Node>;
  edges: Array<Edge>;
} {
  const graph = {
    nodes: Array<Node>(),
    edges: Array<Edge>(),
  };

  // add the root node
  const rootNode = {
    id: process.objects[0].vsmProjectID,
    name: process.objects[0].name,
    hidden: true, //We don't want to see the root node in the canvas
    level: 0,
    width: 200,
    height: 200,
    type: vsmObjectTypes.process,
  };
  graph.nodes.push(rootNode);

  // add the children nodes (level 1)
  process.objects[0].childObjects.forEach((child) => {
    const childNode = {
      id: child.vsmObjectID,
      name: child.name,
      level: 1,
      width: 200,
      height: 200,
      type: child.vsmObjectType.pkObjectType,
    };
    graph.nodes.push(childNode);
    graph.edges.push({
      from: process.vsmProjectID,
      to: child.vsmObjectID,
      hidden: true,
    });

    //Then add the children of the children (level 2++)
    traverseAndAdd(child);

    function traverseAndAdd(
      child:
        | ChildObjectsEntity
        | ChildObjectsEntity1
        | ChildObjectsEntity2
        | ChildObjectsEntity3,
      level = 2
    ) {
      child.childObjects.forEach(
        (
          grandChild:
            | ChildObjectsEntity
            | ChildObjectsEntity1
            | ChildObjectsEntity2
            | ChildObjectsEntity3
        ) => {
          const grandChildNode = {
            id: grandChild.vsmObjectID,
            name: grandChild.name,
            level,
            width: 200,
            height: 200,
            type: grandChild.vsmObjectType.pkObjectType,
          };
          graph.nodes.push(grandChildNode);
          graph.edges.push({
            // add the edge from the child to the grandchild
            from: child.vsmObjectID,
            to: grandChild.vsmObjectID,
          });
        }
      );
      //If there are no grandchildren, we don't need to traverse further
      //but if there are grandchildren, we need to traverse them
      if (child.childObjects.length > 0) {
        child.childObjects.forEach((grandChild) => {
          traverseAndAdd(grandChild, level + 1);
        });
      }
    }
  });

  //Calculate positions for the nodes. Place all nodes at the same level in a row
  //and place the children of each node in a column

  //For each level, calculate the width of the level and the height of the level

  // Group nodes by level
  const nodesByLevel: Array<Node> = groupBy(graph.nodes, "level");

  //for each level, calculate the width of the level
  const levelWidths = Object.keys(nodesByLevel).map((level) => {
    const nodes = nodesByLevel[level];
    //sum the width of all nodes in the level
    return nodes.reduce((sum, node) => sum + node.width, 0);
  });
  //Find the max width of the levels
  const maxLevelWidth = Math.max(...levelWidths);

  //traverse through all levels and place each card in a column
  Object.keys(nodesByLevel).forEach((level) => {
    const nodes = nodesByLevel[level];
    nodes.forEach((node: Node, index: number) => {
      //TODO: calculate the x and y position of the node
      node.position = {
        x: (index * maxLevelWidth) / nodes.length,
        y: Number(level) * node.height,
      };
    });
  });

  //Calculate positions for the edges
  graph.edges.forEach((edge) => {
    const fromNode = graph.nodes.find((node) => node.id === edge.from) as Node;
    const toNode = graph.nodes.find((node) => node.id === edge.to) as Node;
    edge.position = {
      start: {
        x: fromNode.position.x + fromNode.width / 2,
        y: fromNode.position.y + fromNode.height / 2,
      },
      end: {
        x: toNode.position.x + toNode.width / 2,
        y: toNode.position.y + toNode.height / 2,
      },
    };
  });

  return graph;
}

function groupBy(nodes: Node[], arg1: string) {
  return nodes.reduce((r, a) => {
    r[a[arg1]] = [...(r[a[arg1]] || []), a];
    return r;
  }, []);
}
