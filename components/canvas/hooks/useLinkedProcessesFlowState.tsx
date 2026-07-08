import { NodeDataCommon } from "@/types/NodeData";
import { NodeDataApi } from "@/types/NodeDataApi";
import { useLayoutEffect } from "react";
import { useEdgesState, useNodesState, Node, Edge } from "@xyflow/react";
import { createLinkedProcessesEdges } from "../utils/createLinkedProcessesEdges";
import { createLinkedProcessesNodes } from "../utils/createLinkedProcessesNodes";
import { getLinkedProcessesLayout } from "../utils/getLayout";
import {
  chainedProcessShapeSize,
  processhierarchyShapeSize,
} from "../ConnectProcessShapeSize";

export const useLinkedProcessesFlowState = (
  apiNodes: NodeDataApi[],
  isHorizontalFlow = false
) => {
  const [nodes, setNodes] = useNodesState<Node<NodeDataCommon>>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]);
  const shapeSize = isHorizontalFlow
    ? chainedProcessShapeSize
    : processhierarchyShapeSize;

  useLayoutEffect(() => {
    const tempNodes = createLinkedProcessesNodes(
      apiNodes,
      shapeSize,
      isHorizontalFlow
    );
    const finalEdges = createLinkedProcessesEdges(tempNodes);

    const finalNodes = getLinkedProcessesLayout(
      tempNodes,
      finalEdges,
      isHorizontalFlow
    );

    setNodes(finalNodes);
    setEdges(finalEdges);
  }, [apiNodes, isHorizontalFlow]);

  return {
    nodes,
    edges,
  };
};
