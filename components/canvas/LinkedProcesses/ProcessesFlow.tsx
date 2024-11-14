import { useProjectId } from "@/hooks/useProjectId";
import { NodeDataCommon } from "@/types/NodeData";
import { NodeDataApi } from "@/types/NodeDataApi";
import router from "next/router";
import { MouseEvent } from "react";
import ReactFlow, { Node, ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import { edgeElementTypes } from "../EdgeElementTypes";
import { nodeElementTypes } from "../NodeElementTypes";
import { useCenterCanvas } from "../hooks/useCenterCanvas";
import { useLinkedProcessesFlowState } from "../hooks/useLinkedProcessesFlowState";

type ProcessesFlowProps = {
  apiNodes: NodeDataApi[];
  isHorizontalFlow?: boolean;
};

const ProcessesFlow = ({
  apiNodes,
  isHorizontalFlow = false,
}: ProcessesFlowProps) => {
  const { projectId } = useProjectId();
  const { nodes, edges } = useLinkedProcessesFlowState(
    apiNodes,
    isHorizontalFlow
  );

  useCenterCanvas();

  const handleNodeClick = (_: MouseEvent, n: Node<NodeDataCommon>) => {
    const clickedNodeProjectId =
      n.data.linkedProjectData?.vsmProjectID.toString();
    if (clickedNodeProjectId !== projectId) {
      router.replace(
        {
          pathname: `/process/${clickedNodeProjectId}/linked-processes`,
          query: router.query,
        },
        undefined
      );
    }
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeElementTypes}
      edgeTypes={edgeElementTypes}
      elementsSelectable={false}
      nodesDraggable={false}
      onNodeClick={handleNodeClick}
    />
  );
};

export const ProcessesFlowWrapper = (props: ProcessesFlowProps) => {
  return (
    <ReactFlowProvider>
      <ProcessesFlow {...props} />
    </ReactFlowProvider>
  );
};
