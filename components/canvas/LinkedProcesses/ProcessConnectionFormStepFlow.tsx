import { useEffect } from "react";
import { NodeDataFull } from "@/types/NodeData";
import { Typography } from "@equinor/eds-core-react";
import { ReactFlow, Edge, Node, useReactFlow } from "@xyflow/react";
import { edgeElementTypes } from "../EdgeElementTypes";
import { nodeElementTypes } from "../NodeElementTypes";
import styles from "./ProcessConnectionForm.module.scss";
import { CanvasTypeProvider } from "../hooks/useCanvasType";

type ProcessConnectionFormStepFlowProps = {
  nodes: Node<NodeDataFull>[];
  edges: Edge[];
};

export const ProcessConnectionFormStepFlow = ({
  nodes,
  edges,
}: ProcessConnectionFormStepFlowProps) => {
  const { fitView, getViewport, setViewport } = useReactFlow();
  const viewport = getViewport();
  setViewport({ ...viewport, y: 75 });

  useEffect(() => {
    const timeout = setTimeout(() => {
      fitView({
        padding: 0.3,
        maxZoom: 0.6,
        includeHiddenNodes: true,
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [nodes.length]);

  return (
    <>
      <Typography className={styles.title} variant="h3">
        Select the card that the new process card will be added below
      </Typography>
      <CanvasTypeProvider type="select_process_card">
        <ReactFlow
          className={styles.flow}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeElementTypes}
          edgeTypes={edgeElementTypes}
          nodeOrigin={[0.5, 0.5]}
          nodesDraggable={false}
          zoomOnScroll={false}
          panOnDrag={true}
          selectNodesOnDrag={false}
        />
      </CanvasTypeProvider>
    </>
  );
};
