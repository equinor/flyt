import { Process, TasksEntity } from "interfaces/generated";
import { vsmObjectTypes } from "types/vsmObjectTypes";
import { createGraph } from "./createGraph";

export interface GraphNode {
  notPositionedCorrectly?: boolean;
  selected: boolean;
  type: vsmObjectTypes;
  id: number;
  name?: string;
  time?: { value: number; unit: string };
  role?: string;
  hidden?: boolean;
  tasks: Array<TasksEntity>;
  position?: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  level: number;
  choiceGroup: choiceGroupTypes;
  children: Array<number>; // children ids
}
export enum choiceGroupTypes {
  Left = "Left",
  Right = "Right",
  Center = "Center",
}
export interface GraphEdge {
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
  label?: string;
}

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  pointer: {
    x: number;
    y: number;
  };
};

export class Graph {
  navigateRight(): GraphNode {
    // debugger;
    const selectedNode = this.nodes.find((node) => node.selected);
    if (!selectedNode) {
      return;
    }
    const { x, y } = selectedNode.position;
    const { height } = selectedNode;
    //find the next node that is to the right of the selected node
    // sort nodes by x position
    const sortedNodes = this.nodes.sort(this.sortByXPosition);
    const nextNode = sortedNodes.find((node) => {
      // const nextNode = this.nodes.find((node) => {
      const { x: nodeX, y: nodeY } = node.position;
      return nodeX > x && nodeY >= y && nodeY <= y + height; //node is in the same row;
    });
    // debugger;
    //select nextNode
    if (nextNode) {
      this.selectNode(nextNode);
    }
    return nextNode;
  }
  navigateLeft(): GraphNode {
    const selectedNode = this.nodes.find((node) => node.selected);
    if (!selectedNode) {
      return;
    }
    const { x, y } = selectedNode.position;
    const { height } = selectedNode;
    //find the next node that is to the left of the selected node

    //sort nodes by x position
    const sortedNodes = this.nodes.sort(this.sortByXPosition).reverse();
    const nextNode = sortedNodes.find((node) => {
      // const nextNode = this.nodes.reverse().find((node) => {
      const { x: nodeX, y: nodeY } = node.position;
      return nodeX < x && nodeY >= y && nodeY <= y + height; //node is in the same row;
    });
    //select nextNode
    if (nextNode) {
      this.selectNode(nextNode);
    }
    return nextNode;
  }

  navigateUp(): GraphNode {
    const selectedNode = this.nodes.find((node) => node.selected);
    if (!selectedNode) {
      return;
    }
    const { x, y } = selectedNode.position;
    const { width } = selectedNode;
    //find the next node that is over the selected node
    // sort nodes by y position
    const sortedNodes = this.nodes.sort(this.sortByYPosition).reverse();
    const nextNode = sortedNodes.find((node) => {
      // const nextNode = this.nodes.find((node) => {
      const { x: nodeX, y: nodeY } = node.position;
      return nodeX >= x && nodeX <= x + width && nodeY < y;
    });
    //select nextNode
    if (nextNode) {
      this.selectNode(nextNode);
    }
    return nextNode;
  }
  navigateDown(): GraphNode {
    const selectedNode = this.nodes.find((node) => node.selected);

    if (!selectedNode) {
      return;
    }
    const { x, y } = selectedNode.position;
    const { width } = selectedNode;

    //find the next node that is under the selected node
    // sort nodes by y position
    const sortedNodes = this.nodes.sort(this.sortByYPosition);
    const nextNode = sortedNodes.find((node) => {
      // const nextNode = this.nodes.find((node) => {
      const { x: nodeX, y: nodeY } = node.position;
      return nodeX >= x && nodeX <= x + width && nodeY > y;
    });
    //select nextNode
    if (nextNode) {
      this.selectNode(nextNode);
    }
    return nextNode;
  }
  process: Process;
  nodes: Array<GraphNode>;
  edges: Array<GraphEdge>;
  users: Array<User>;

  constructor(process: Process) {
    const graph = createGraph(process);
    this.nodes = graph.nodes;
    this.edges = graph.edges;
  }

  sortByXPosition = (a: GraphNode, b: GraphNode): -1 | 1 | 0 => {
    const { x: aX } = a.position;
    const { x: bX } = b.position;

    if (aX < bX) {
      return -1;
    }
    if (aX > bX) {
      return 1;
    }
    return 0;
  };
  sortByYPosition = (a: GraphNode, b: GraphNode): -1 | 1 | 0 => {
    const { y: aY } = a.position;
    const { y: bY } = b.position;

    if (aY < bY) {
      return -1;
    }
    if (aY > bY) {
      return 1;
    }
    return 0;
  };

  getNode(id: number): GraphNode {
    const result = this.nodes.find((node) => node.id === id);
    if (!result) {
      throw new Error(`Node with id ${id} not found`);
    }
    return result;
  }

  getEdge(from: number, to: number): GraphEdge {
    const result = this.edges.find(
      (edge) => edge.from === from && edge.to === to
    );
    if (!result) {
      throw new Error(`Edge from ${from} to ${to} not found`);
    }
    return result;
  }

  updateNodePosition(node: GraphNode, x: number, y: number): void {
    const { position } = node;
    if (!position) {
      throw new Error(`Node ${node.id} has no position`);
    }
    position.x = x;
    position.y = y;
  }

  /**
   * Returns all edges that are connected to the node
   * @param node GraphNode - node to get edges for
   * @returns Array<GraphEdge> - all edges that are connected to the node
   */
  getNodeEdges(node: GraphNode): Array<GraphEdge> {
    return this.edges.filter(
      (edge) => edge.from === node.id || edge.to === node.id
    );
  }

  /**
   * Returns all nodes that are direct neighbors of the node
   * @param node GraphNode - node to get edges for
   * @returns Array<GraphEdge> - all edges that are connected to the node
   */
  getNodeNeighbors(node: GraphNode): Array<GraphNode> {
    const edges = this.getNodeEdges(node);
    const edgesComingIntoThisNode = edges.map((edge) => this.getNode(edge.to));
    const edgesGoingOutOfThisNode = edges.map((edge) =>
      this.getNode(edge.from)
    );
    return [...edgesComingIntoThisNode, ...edgesGoingOutOfThisNode];
  }

  /**
   * Checks if something is at the given position
   * @param x - x position to check
   * @param y - y position to check
   * @returns GraphNode | GraphEdge | null - node or edge at the given position
   */
  hitTest(x: number, y: number): { node: GraphNode; edge: GraphEdge } {
    const node = this.nodes.find((node) => {
      const { position } = node;
      if (!position) {
        return false;
      }
      const { x: nodeX, y: nodeY } = position;
      return (
        x >= nodeX &&
        x <= nodeX + node.width &&
        y >= nodeY &&
        y <= nodeY + node.height
      );
    });
    if (node) {
      return { node, edge: null };
    }
    const edge = this.edges.find((edge) => {
      const { position } = edge;
      if (!position) {
        return false;
      }
      const { start, end } = position;
      const { x: startX, y: startY } = start;
      const { x: endX, y: endY } = end;
      return x >= startX && x <= endX && y >= startY && y <= endY;
    });
    if (edge) {
      return { node: null, edge };
    }
    return { node: null, edge: null };
  }

  selectNode(node: GraphNode): void {
    this.nodes.forEach((n) => (n.selected = n === node));
  }
  deselectAllNodes(): void {
    this.nodes.forEach((n) => (n.selected = false));
  }
  dragNode(node: GraphNode, x: number, y: number): void {
    this.updateNodePosition(node, x, y);
  }
  dragNodeStart(node: GraphNode): void {
    this.selectNode(node);
  }
  dragNodeEnd(): void {
    this.deselectAllNodes();
  }
  getSelectedNodes(): Array<GraphNode> {
    return this.nodes.filter((node) => node.selected);
  }
}
