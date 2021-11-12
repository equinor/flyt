import { Process, TasksEntity } from "interfaces/generated";
import { vsmObjectTypes } from "types/vsmObjectTypes";
import { createGraph } from "./createGraph";

export interface GraphNode {
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
  process: Process;
  nodes: Array<GraphNode>;
  edges: Array<GraphEdge>;
  users: Array<User>;

  constructor(process: Process) {
    const graph = createGraph(process);
    this.nodes = graph.nodes;
    this.edges = graph.edges;
  }

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
    return edges.map((edge) => this.getNode(edge.to));
  }

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
}
