import { edgeElementTypes } from "@/components/canvas/EdgeElementTypes";
import { MiniMapCustom } from "@/components/canvas/MiniMapCustom";
import { ZoomLevel } from "@/components/canvas/ZoomLevel";
import { EdgeDataApi } from "@/types/EdgeDataApi";
import { NodeDataApi } from "@/types/NodeDataApi";
import { useEffect, useState } from "react";
import ReactFlow, {
  ControlButton,
  Controls,
  Node,
  Position,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { NodeDataCommon } from "types/NodeData";
import { DeleteNodeDialog } from "../DeleteNodeDialog";
import { ScrimDelete } from "../ScrimDelete";
import { SideBar } from "../SideBar";
import styles from "./Canvas.module.scss";
import { nodeElementTypes } from "./NodeElementTypes";
import { useCenterCanvas } from "./hooks/useCenterCanvas";
import { useCopyPaste } from "./hooks/useCopyPaste";
import { useEdgeDelete } from "./hooks/useEdgeDelete";
import { useFlowState } from "./hooks/useFlowState";
import { useNodeAdd } from "./hooks/useNodeAdd";
import { useNodeDrag } from "./hooks/useNodeDrag";
import { copyPasteNodeValidator } from "./utils/copyPasteValidators";
import { validTarget } from "./utils/validTarget";

type CanvasProps = {
  apiNodes: NodeDataApi[];
  apiEdges: EdgeDataApi[];
  userCanEdit: boolean;
};

const Flow = ({ apiNodes, apiEdges, userCanEdit }: CanvasProps) => {
  const [visibleDeleteNodeScrim, setVisibleDeleteNodeScrim] = useState(false);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    selectedNode,
    setSelectedNode,
    hoveredNode,
    setHoveredNode,
    handleSetSelectedEdge,
    edgeToBeDeletedId,
    setEdgeToBeDeletedId,
  } = useFlowState(apiNodes, apiEdges, userCanEdit);
  const { addNode } = useNodeAdd();
  const { onNodeDragStart, onNodeDrag, onNodeDragStop } = useNodeDrag();
  const { deleteEdgeMutation } = useEdgeDelete();

  useCenterCanvas();

  useCopyPaste(
    hoveredNode,
    (node: Node<NodeDataCommon>) =>
      hoveredNode?.id &&
      validTarget(node, hoveredNode, nodes, false) &&
      addNode(hoveredNode.id, node.data, Position.Bottom),
    copyPasteNodeValidator
  );

  useEffect(() => {
    if (selectedNode?.data.linkedProjectData) {
      window.open(
        `${window.location.origin}/process/${selectedNode.data.linkedProjectData.vsmProjectID}`
      );
      setSelectedNode(undefined);
    }
  }, [selectedNode]);

  return (
    <>
      {selectedNode && (
        <DeleteNodeDialog
          objectToDelete={selectedNode.data}
          visible={visibleDeleteNodeScrim}
          onClose={() => {
            setVisibleDeleteNodeScrim(false);
            setSelectedNode(undefined);
          }}
        />
      )}
      {edgeToBeDeletedId && (
        <ScrimDelete
          id={edgeToBeDeletedId}
          open={!!edgeToBeDeletedId}
          onConfirm={(id) => {
            deleteEdgeMutation.mutate(
              { edgeId: id },
              {
                onSuccess() {
                  setEdgeToBeDeletedId(undefined);
                },
              }
            );
          }}
          onClose={() => setEdgeToBeDeletedId(undefined)}
          header={"Delete line"}
          warningMessage={"Are you sure you want to delete this line?"}
          confirmMessage={"Delete"}
          isLoading={deleteEdgeMutation.isLoading}
          error={deleteEdgeMutation.error}
        />
      )}
      <SideBar
        onClose={() => setSelectedNode(undefined)}
        onDelete={() => setVisibleDeleteNodeScrim(true)}
        canEdit={userCanEdit}
        selectedNode={selectedNode?.data}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeElementTypes}
        edgeTypes={edgeElementTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={() => setSelectedNode(undefined)}
        minZoom={0.2}
        nodesDraggable={userCanEdit}
        nodesConnectable={true}
        zoomOnDoubleClick={false}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        elevateEdgesOnSelect={true}
        edgesFocusable={userCanEdit}
        onNodeMouseEnter={(_, node) => setHoveredNode(node)}
        onNodeMouseLeave={() => setHoveredNode(undefined)}
        onEdgeMouseEnter={(_, edge) => handleSetSelectedEdge(edge)}
        onEdgeMouseLeave={() => handleSetSelectedEdge(undefined)}
        attributionPosition="bottom-right"
        connectionRadius={100}
        nodeDragThreshold={15}
      >
        <MiniMapCustom />
        <Controls className={styles.controls} showInteractive={false}>
          <ControlButton className={styles.zoomContainer}>
            <ZoomLevel />
          </ControlButton>
        </Controls>
      </ReactFlow>
    </>
  );
};

export const FlowWrapper = (props: CanvasProps) => {
  return (
    <ReactFlowProvider>
      <Flow {...props} />
    </ReactFlowProvider>
  );
};
