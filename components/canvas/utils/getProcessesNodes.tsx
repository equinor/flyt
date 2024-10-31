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

const getLinkedNodes = (
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
      getLinkedNodes(apiNodes, childNode, linkedProcesses, visited);
    }
  });

  return linkedProcesses;
};

// Filter linked processes and reorder nodes in a hierarchical parent-child structure
const getRestructuredNodes = (
  apiNodes: NodeDataApi[],
  projectNode: NodeDataApi,
  columnFirstNodesTypes: NodeTypes[],
  addNodesToProjectChildren = true,
  addProjectToNodeChildren = false
): NodeDataApi[] => {
  const restructuredNodes: NodeDataApi[] = [];

  apiNodes.forEach((n) => {
    if (columnFirstNodesTypes.includes(n.type)) {
      const linkedNodes = getLinkedNodes(apiNodes, n, []);
      linkedNodes.forEach((linkedNode) => {
        restructuredNodes.push(linkedNode);
        if (addNodesToProjectChildren) {
          projectNode.children.push(linkedNode.id);
        }
        if (addProjectToNodeChildren) {
          linkedNode.children.push(projectNode.id);
        }
      });
    }
  });

  return restructuredNodes;
};

export const getHierarchyNodes = (
  apiNodes: NodeDataApi[],
  project: Project
): NodeDataApi[] => {
  const projectNode = createProjectNode(project);
  const mainActivitiesNodes = getRestructuredNodes(apiNodes, projectNode, [
    NodeTypes.mainActivity,
  ]);

  return [...mainActivitiesNodes, projectNode];
};

export const getChainedNodes = (
  apiNodes: NodeDataApi[],
  project: Project
): NodeDataApi[] => {
  const projectNode = createProjectNode(project);

  const inputNodes = getRestructuredNodes(
    apiNodes,
    projectNode,
    [NodeTypes.input],
    false,
    true
  );

  const outputNodes = getRestructuredNodes(apiNodes, projectNode, [
    NodeTypes.output,
  ]);

  return [...inputNodes, ...outputNodes, projectNode];
};
