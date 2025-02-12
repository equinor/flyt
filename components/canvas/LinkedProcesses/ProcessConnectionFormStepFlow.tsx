import { NodeDataFull } from "@/types/NodeData";
import { Typography } from "@equinor/eds-core-react";
import ReactFlow, { Edge, Node } from "reactflow";
import { edgeElementTypes } from "../EdgeElementTypes";
import { useCenterCanvas } from "../hooks/useCenterCanvas";
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
  useCenterCanvas();

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
          selectNodesOnDrag={false}
          draggable={false}
        />
      </CanvasTypeProvider>
    </>
  );
};
