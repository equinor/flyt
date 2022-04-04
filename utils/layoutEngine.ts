import { Process, TasksEntity } from "interfaces/generated";
import { mockProcessGraph } from "./createGraph";
import { vsmObjectTypes } from "types/vsmObjectTypes";
import { parseProcessJSON } from "./processParser/parseProcessJSON";
import { vsmProject } from "../interfaces/VsmProject";
import { characterEntities } from "character-entities";
import par = characterEntities.par;
import { positionNodes } from "./positionNodes";
import { positionNodesAndEdges } from "./PositionNodesAndEdges";
import { calculateEdgePositions as positionEdges } from "./calculateEdgePositions";

export interface GraphNode {
  notPositionedCorrectly?: boolean;
  selected?: boolean;
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
  width?: number;
  height?: number;
  level?: number;
  choiceGroup?: "Left" | "Right" | "Center";
  children?: Array<number>; // children ids
}

export interface GraphEdge {
  highlighted?: boolean;
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
  users: Array<User>;

  constructor(process: vsmProject) {
    const graph = mockProcessGraph(process);
    const { nodes, edges } = graph;
    // const parsedProcess = parseProcessJSON(process);
    // const { nodes, edges } = parsedProcess;
    positionNodesAndEdges({ nodes, edges });

    this.nodes = nodes;
    this.edges = edges;
  }

  private _nodes: Array<GraphNode>;

  public get nodes(): Array<GraphNode> {
    return this._nodes;
  }

  private set nodes(value: Array<GraphNode>) {
    this._nodes = value;
  }

  private _edges: Array<GraphEdge>;

  public get edges(): Array<GraphEdge> {
    return this._edges;
  }

  private set edges(value: Array<GraphEdge>) {
    this._edges = value;
  }

  getIncomingEdges(node: GraphNode) {
    return this.edges.filter((edge) => edge.to === node.id);
  }

  getOutgoingEdges(node: GraphNode) {
    return this.edges.filter((edge) => edge.from === node.id);
  }

  navigateRight(): GraphNode {
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
    //select nextNode
    if (nextNode) this.selectNode(nextNode);
    return nextNode;
  }

  navigateLeft(): GraphNode {
    const selectedNode = this.nodes.find((node) => node.selected);
    if (!selectedNode) return;
    const { x, y } = selectedNode.position;
    const { height } = selectedNode;
    //find the next node that is to the left of the selected node

    const sortedNodes = this.nodes.sort(this.sortByXPosition).reverse(); //reverse to get the rightmost node first
    const nextNode = sortedNodes.find((node) => {
      const { x: nodeX, y: nodeY } = node.position;
      return nodeX < x && nodeY >= y && nodeY <= y + height; //node is in the same row;
    });
    //select nextNode
    if (nextNode) this.selectNode(nextNode);
    return nextNode;
  }

  navigateUp(): GraphNode {
    const selectedNode = this.nodes.find((node) => node.selected);
    if (!selectedNode) return;
    const { x, y } = selectedNode.position;
    const { width } = selectedNode;
    //find the next node that is over the selected node

    const sortedNodes = this.nodes.sort(this.sortByYPosition).reverse(); //reverse to get the bottommost node first
    const nextNode = sortedNodes.find((node) => {
      const { x: nodeX, y: nodeY } = node.position;
      return nodeX >= x && nodeX <= x + width && nodeY < y; //node is in the same column;
    });
    //select nextNode
    if (nextNode) this.selectNode(nextNode);
    return nextNode;
  }

  navigateDown(): GraphNode {
    const selectedNode = this.nodes.find((node) => node.selected);

    if (!selectedNode) return;
    const { x, y } = selectedNode.position;
    const { width } = selectedNode;

    //find the next node that is under the selected node
    // sort nodes by y position
    const sortedNodes = this.nodes.sort(this.sortByYPosition);
    const nextNode = sortedNodes.find((node) => {
      const { x: nodeX, y: nodeY } = node.position;
      return nodeX >= x && nodeX <= x + width && nodeY > y; //node is in the same column;
    });
    //select nextNode
    if (nextNode) this.selectNode(nextNode);
    return nextNode;
  }

  sortByXPosition = (a: GraphNode, b: GraphNode): -1 | 1 | 0 => {
    const { x: aX } = a.position;
    const { x: bX } = b.position;

    if (aX < bX) return -1;
    if (aX > bX) return 1;
    return 0;
  };

  sortByYPosition = (a: GraphNode, b: GraphNode): -1 | 1 | 0 => {
    const { y: aY } = a.position;
    const { y: bY } = b.position;

    if (aY < bY) return -1;
    if (aY > bY) return 1;
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
   * Get the closest node to the position
   * @param x - x position
   * @param y - y position
   * @returns closest node to the position
   */
  getClosestNode(x: number, y: number): GraphNode {
    //  get the distance to all nodes
    const distances = this.nodes.map((node) => {
      // const { x: nodeX, y: nodeY } = node.position;
      const nodeX = node.position.x + node.width / 2;
      const nodeY = node.position.y + node.height / 2;
      return Math.sqrt(Math.pow(nodeX - x, 2) + Math.pow(nodeY - y, 2));
    });
    // get the index of the smallest distance
    const indexOfSmallestDistance = distances.indexOf(Math.min(...distances));
    // return the node at that index
    return this.nodes[indexOfSmallestDistance];
  }

  /**
   * Checks if something is at the given position
   * Note: the position is global, and you need to account for a potential viewport offset depending on how you are rendering the graph
   * @param x - x position to check
   * @param y - y position to check
   * @returns GraphNode | GraphEdge | null - node or edge at the given position
   */
  hitTest(x: number, y: number): { node: GraphNode; edge: GraphEdge } {
    const node = this.nodes.find((node) => {
      const { position } = node;
      if (!position) return false;
      return (
        x >= position.x &&
        x <= position.x + node.width &&
        y >= position.y &&
        y <= position.y + node.height
      );
    });
    const edge = this.edges.find((edge) => {
      const { position } = edge;
      if (!position) return false;
      const { start, end } = position;
      return x >= start.x && x <= end.x && y >= start.y && y <= end.y;
    });
    return { node, edge };
  }

  // Add child to node
  addChild(node: GraphNode, child: GraphNode): void {
    const edge = this.getEdge(node.id, child.id);
    if (edge) return; // edge already exists
    this.edges.push({
      from: node.id,
      to: child.id,
    });
  }

  // Remove child from node
  removeChild(node: GraphNode, child: GraphNode): void {
    const edge = this.getEdge(node.id, child.id);
    if (!edge) return; // edge does not exist
    this.edges = this.edges.filter((edge) => {
      return edge.from !== node.id || edge.to !== child.id;
    });
  }

  //add new node to graph
  addNode(node: GraphNode, parent: GraphNode): void {
    this.nodes.push(node);
    this.addChild(parent, node);
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
