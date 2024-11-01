import type { NodeDataApi } from "@/types/NodeDataApi";
import { NodeTypes } from "@/types/NodeTypes";
import type { Project } from "@/types/Project";

const createProjectNode = (project: Project): NodeDataApi => ({
  id: project.vsmProjectID.toString(),
  type: NodeTypes.project,
  projectId: project.vsmProjectID.toString(),
  index: null,
  order: null,
  description: "",
  role: null,
  duration: null,
  unit: null,
  children: [],
  tasks: [],
  linkedProject: null,
  linkedProjectData: project,
});

const _getLinkedNodesRecursive = (
  apiNodes: NodeDataApi[],
  node: NodeDataApi,
  linkedProcesses: NodeDataApi[],
  visited: Set<string> = new Set()
): NodeDataApi[] => {
  if (visited.has(node.id)) return linkedProcesses;
  visited.add(node.id);

  if (node.type === NodeTypes.linkedProcess) {
    linkedProcesses.push({ ...node, children: [] });
  }

  node.children?.forEach((childId) => {
    const childNode = apiNodes.find((n) => n.id === childId);
    if (childNode) {
      _getLinkedNodesRecursive(apiNodes, childNode, linkedProcesses, visited);
    }
  });

  return linkedProcesses;
};

const getLinkedNodes = (apiNodes: NodeDataApi[], node: NodeDataApi) =>
  _getLinkedNodesRecursive(apiNodes, node, []);

const getRestructuredNodes = (
  apiNodes: NodeDataApi[],
  columnFirstNodesTypes: NodeTypes[]
): NodeDataApi[] => {
  let restructuredNodes: NodeDataApi[] = [];

  apiNodes.forEach((n) => {
    if (columnFirstNodesTypes.includes(n.type)) {
      const linkedNodes = getLinkedNodes(apiNodes, n);
      restructuredNodes = restructuredNodes.concat(linkedNodes);
    }
  });

  return restructuredNodes;
};

const updateNodeChildren = (node: NodeDataApi, newChildren: NodeDataApi[]) =>
  (node.children = node.children.concat(newChildren.map((node) => node.id)));

export const getHierarchyNodes = (
  apiNodes: NodeDataApi[],
  project: Project
): NodeDataApi[] => {
  const projectNode = createProjectNode(project);
  const mainActivitiesNodes = getRestructuredNodes(apiNodes, [
    NodeTypes.mainActivity,
  ]);

  updateNodeChildren(projectNode, mainActivitiesNodes);

  return [...mainActivitiesNodes, projectNode];
};

export const getChainedNodes = (
  apiNodes: NodeDataApi[],
  project: Project
): NodeDataApi[] => {
  const projectNode = createProjectNode(project);

  const inputNodes = getRestructuredNodes(apiNodes, [NodeTypes.input]);

  inputNodes.forEach((node) => {
    updateNodeChildren(node, [projectNode]);
  });

  const outputNodes = getRestructuredNodes(apiNodes, [NodeTypes.output]);

  updateNodeChildren(projectNode, outputNodes);

  return [...inputNodes, ...outputNodes, projectNode];
};
