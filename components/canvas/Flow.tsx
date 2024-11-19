import { edgeElementTypes } from "@/components/canvas/EdgeElementTypes";
import { MiniMapCustom } from "@/components/canvas/MiniMapCustom";
import { ZoomLevel } from "@/components/canvas/ZoomLevel";
import { EdgeDataApi } from "@/types/EdgeDataApi";
import { NodeDataApi } from "@/types/NodeDataApi";
import { useEffect, useRef } from "react";
import ReactFlow, {
  ControlButton,
  Controls,
  Node,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { NodeDataCommon } from "types/NodeData";
import { DeleteNodeDialog } from "../DeleteNodeDialog";
import { ScrimDelete } from "../ScrimDelete";
import { SideBar } from "./Sidebar/SideBar";
import styles from "./Canvas.module.scss";
import { ContextMenu } from "./ContextMenu";
import { nodeElementTypes } from "./NodeElementTypes";
import { useCenterCanvas } from "./hooks/useCenterCanvas";
import { useContextMenu } from "./hooks/useContextMenu";
import { useCopyPaste } from "./hooks/useCopyPaste";
import { useEdgeDelete } from "./hooks/useEdgeDelete";
import { useFlowState } from "./hooks/useFlowState";
import { useNodeAdd } from "./hooks/useNodeAdd";
import { useNodeDrag } from "./hooks/useNodeDrag";
import { copyPasteNodeValidator } from "./utils/copyPasteValidators";
import { handlePasteNode } from "./utils/handlePasteNode";
import { useStoreState, useStoreDispatch } from "@/hooks/storeHooks";

type CanvasProps = {
  apiNodes: NodeDataApi[];
  apiEdges: EdgeDataApi[];
  userCanEdit: boolean;
};

const Flow = ({ apiNodes, apiEdges, userCanEdit }: CanvasProps) => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    selectedNode,
    setSelectedNode,
    hoveredNode,
    setHoveredNode,
    nodeToBeDeleted,
    setNodeToBeDeleted,
    handleSetSelectedEdge,
    edgeToBeDeletedId,
    setEdgeToBeDeletedId,
  } = useFlowState(apiNodes, apiEdges, userCanEdit);
  const { addNode } = useNodeAdd();
  const { onNodeDragStart, onNodeDrag, onNodeDragStop } = useNodeDrag();
  const { deleteEdgeMutation } = useEdgeDelete();
  const { centerCanvas } = useCenterCanvas();
  const pqirToBeDeletedId = useStoreState((state) => state.pqirToBeDeletedId);
  const dispatch = useStoreDispatch();

  const ref = useRef<HTMLDivElement>(null);
  const { menuData, onNodeContextMenu, onPaneContextMenu, closeContextMenu } =
    useContextMenu(ref);

  const { copyToClipboard, paste } = useCopyPaste(
    hoveredNode,
    (node: Node<NodeDataCommon>) =>
      handlePasteNode(node, hoveredNode, nodes, addNode),
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
      <DeleteNodeDialog
        open={!!nodeToBeDeleted?.data}
        objectToDelete={nodeToBeDeleted?.data}
        onClose={() => {
          setNodeToBeDeleted(undefined);
          setSelectedNode(undefined);
        }}
      />
      <ScrimDelete
        id={"scrimDeleteEdge"}
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
        header="Delete line"
        warningMessage="Are you sure you want to delete this line?"
        confirmMessage="Delete"
        isLoading={deleteEdgeMutation.isLoading}
        error={deleteEdgeMutation.error}
      />
      <ScrimDelete
        id={"scrimDeletePQIR"}
        open={!!pqirToBeDeletedId}
        onClose={() => dispatch.setPQIRToBeDeletedId(null)}
        onConfirm={() => console.log(pqirToBeDeletedId)}
        header="Delete PQIR"
        warningMessage="Are you sure you want to delete this PQIR?"
        confirmMessage="Delete"
      />
      <SideBar
        onClose={() => setSelectedNode(undefined)}
        userCanEdit={userCanEdit}
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
        onMoveStart={() => closeContextMenu()}
        minZoom={0.2}
        nodesDraggable={userCanEdit}
        nodesConnectable={true}
        zoomOnDoubleClick={false}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        selectNodesOnDrag={false}
        elevateEdgesOnSelect={true}
        edgesFocusable={userCanEdit}
        onNodeMouseEnter={(_, node) => {
          !menuData && setHoveredNode(node);
        }}
        onNodeMouseLeave={() => {
          !menuData && setHoveredNode(undefined);
        }}
        onEdgeMouseEnter={(_, edge) => handleSetSelectedEdge(edge)}
        onEdgeMouseLeave={() => handleSetSelectedEdge(undefined)}
        connectionRadius={100}
        nodeDragThreshold={15}
        onNodeContextMenu={onNodeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        ref={ref}
      >
        <MiniMapCustom />
        <Controls className={styles.controls} showInteractive={false}>
          <ControlButton className={styles.zoomContainer}>
            <ZoomLevel />
          </ControlButton>
        </Controls>
        {menuData && (
          <ContextMenu
            menuData={menuData}
            copyToClipBoard={copyToClipboard}
            paste={paste}
            centerCanvas={centerCanvas}
            onDelete={(node) => setNodeToBeDeleted(node)}
            onEditNode={(node) => setSelectedNode(node)}
            canvasRef={ref}
          />
        )}
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
