import { NodeDataFull } from "@/types/NodeData";
import { NodeDataApi } from "@/types/NodeDataApi";
import { useLayoutEffect } from "react";
import { useEdgesState, useNodesState } from "reactflow";
import { createLinkedProcessesEdges } from "../utils/createLinkedProcessesEdges";
import { createLinkedProcessesNodes } from "../utils/createLinkedProcessesNodes";
import { getLinkedProcessesLayout } from "../utils/getLayout";

export const useLinkedProcessesFlowState = (
  apiNodes: NodeDataApi[],
  isHorizontalFlow = false
) => {
  const [nodes, setNodes] = useNodesState<NodeDataFull>([]);
  const [edges, setEdges] = useEdgesState([]);
  const shapeSize = { height: 130, width: 290 };

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
