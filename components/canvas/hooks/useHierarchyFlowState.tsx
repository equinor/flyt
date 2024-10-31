import { NodeDataFull } from "@/types/NodeData";
import { NodeDataApi } from "@/types/NodeDataApi";
import { useLayoutEffect } from "react";
import { useEdgesState, useNodesState } from "reactflow";
import { createProcessHierarchyEdges } from "../utils/createProcessHierarchyEdges";
import { createProcessHierarchyNodes } from "../utils/createProcessHierarchyNodes";
import { getHierarchyLayout } from "../utils/getLayout";

export const useHierarchyFlowState = (
  apiNodes: NodeDataApi[],
  isHorizontalFlow = false
) => {
  const [nodes, setNodes] = useNodesState<NodeDataFull>([]);
  const [edges, setEdges] = useEdgesState([]);
  const shapeSize = { height: 130, width: 290 };

  useLayoutEffect(() => {
    const tempNodes = createProcessHierarchyNodes(
      apiNodes,
      shapeSize,
      isHorizontalFlow
    );
    const finalEdges = createProcessHierarchyEdges(tempNodes);

    const finalNodes = getHierarchyLayout(
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
