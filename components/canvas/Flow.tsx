import { edgeElementTypes } from "@/components/canvas/EdgeElementTypes";
import { MiniMapCustom } from "@/components/canvas/MiniMapCustom";
import { ZoomLevel } from "@/components/canvas/ZoomLevel";
import { useStoreDispatch, useStoreState } from "@/hooks/storeHooks";
import type { EdgeDataApi } from "@/types/EdgeDataApi";
import type { NodeDataCommon, NodeDataFull } from "@/types/NodeData";
import type { NodeDataApi } from "@/types/NodeDataApi";
import { useEffect, useRef } from "react";
import {
  ReactFlow,
  ControlButton,
  Controls,
  type Edge,
  type Node,
  type NodeMouseHandler,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DeleteNodeDialog } from "../DeleteNodeDialog";
import { ScrimDelete } from "../ScrimDelete";
import styles from "./Canvas.module.scss";
import { ContextMenu } from "./ContextMenu";
import { nodeElementTypes } from "./NodeElementTypes";
import { SideBar } from "./Sidebar/SideBar";
import { usePQIRMutations } from "./Sidebar/usePQIRMutations";
import { useCenterCanvas } from "./hooks/useCenterCanvas";
import { useContextMenu } from "./hooks/useContextMenu";
import { useCopyPaste } from "./hooks/useCopyPaste";
import { useEdgeDelete } from "./hooks/useEdgeDelete";
import { useFlowState } from "./hooks/useFlowState";
import { useNodeAdd } from "./hooks/useNodeAdd";
import { useNodeDrag } from "./hooks/useNodeDrag";
import { useSelectedNodeForPQIR } from "./hooks/useSelectedNodeForPQIR";
import {
  SelectedNodeForPQIRidProvider,
  useSelectedNodeForPQIRid,
} from "./hooks/useSelectedNodeForPQIRid";
import { copyPasteNodeValidator } from "./utils/copyPasteValidators";
import { handlePasteNode } from "./utils/handlePasteNode";
import { useWebSocket } from "./hooks/useWebSocket";
import NetworkToast from "../NetworkToast";
import type { CardAccess } from "@/types/CardAccess";
import { getQIPRContainerWidth } from "./utils/getQIPRContainerWidth";
import { NodeTypes } from "@/types/NodeTypes";
import { CanvasEdgeData } from "./utils/createEdges";

type CanvasProps = {
  apiNodes: NodeDataApi[];
  apiEdges: EdgeDataApi[];
  userCanEdit: boolean;
  userEditCardStatus: CardAccess[];
};

const Flow = ({
  apiNodes,
  apiEdges,
  userCanEdit,
  userEditCardStatus,
}: CanvasProps) => {
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
  } = useFlowState(apiNodes, apiEdges, userCanEdit, userEditCardStatus);
  const { deletePQIR } = usePQIRMutations();
  const { addNode } = useNodeAdd();
  const { onNodeDragStart, onNodeDrag, onNodeDragStop } = useNodeDrag();
  const { deleteEdgeMutation } = useEdgeDelete();
  const { centerCanvas } = useCenterCanvas();
  const pqirToBeDeletedId = useStoreState((state) => state.pqirToBeDeletedId);
  const { setSelectedNodeForPQIRid } = useSelectedNodeForPQIRid();
  const selectedNodeForPQIR = useSelectedNodeForPQIR();
  const dispatch = useStoreDispatch();

  const ref = useRef<HTMLDivElement>(null);
  const { menuData, onNodeContextMenu, onPaneContextMenu, closeContextMenu } =
    useContextMenu(ref);
  const anyNodeIsSelected = selectedNode !== undefined || !!selectedNodeForPQIR;
  const { socketConnected } = useWebSocket();

  const { copyToClipboard, paste } = useCopyPaste(
    hoveredNode,
    (node: Node<NodeDataCommon>) =>
      handlePasteNode(node, hoveredNode, nodes, addNode),
    anyNodeIsSelected,
    userCanEdit,
    copyPasteNodeValidator
  );

  const onNodeMouseLeave: NodeMouseHandler<Node<NodeDataFull>> = (
    _event,
    hoveredNode
  ) => {
    if (menuData || hoveredNode.selected) {
      return;
    }

    const canHavePQIR =
      hoveredNode.data.type !== NodeTypes.choice &&
      hoveredNode.data.type !== NodeTypes.linkedProcess &&
      hoveredNode.data.type !== NodeTypes.hidden;

    if (canHavePQIR && ((hoveredNode as Node<NodeDataCommon>).data.tasks ?? []).length === 0) {
      const width = hoveredNode.measured?.width ?? hoveredNode.width ?? 140;
      const height = hoveredNode.measured?.height ?? hoveredNode.height ?? 140;

      onNodesChange([
        {
          id: hoveredNode.id,
          type: "dimensions",
          setAttributes: "width",
          dimensions: {
            width: width - getQIPRContainerWidth((hoveredNode as Node<NodeDataCommon>).data.tasks),
            height: height,
          },
        },
      ]);
    }
    setHoveredNode(undefined);
  };

  const onNodeMouseEnter: NodeMouseHandler<Node<NodeDataFull>> = (
    _event,
    node
  ) => {
    if (menuData || node.selected) {
      return;
    }

    const canHavePQIR =
      node.data.type !== NodeTypes.choice &&
      node.data.type !== NodeTypes.linkedProcess &&
      node.data.type !== NodeTypes.hidden;

    if (canHavePQIR && ((node as Node<NodeDataCommon>).data.tasks ?? []).length === 0) {
      const width = node.measured?.width ?? node.width ?? 140;
      const height = node.measured?.height ?? node.height ?? 140;

      onNodesChange([
        {
          id: node.id,
          type: "dimensions",
          setAttributes: "width",
          dimensions: {
            width: width + getQIPRContainerWidth((node as Node<NodeDataCommon>).data.tasks),
            height: height,
          },
        },
      ]);
    }
    setHoveredNode(node as Node<NodeDataCommon>);
  };
  useEffect(() => {
    if (selectedNode?.data.linkedProjectData) {
      window.open(
        `${window.location.origin}/process/${selectedNode.data.linkedProjectData.vsmProjectID}`
      );
      setSelectedNode(undefined);
    }
  }, [selectedNode]);

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "hidden") {
        setSelectedNode(undefined);
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => {
      document.removeEventListener("visibilitychange", handler);
    };
  }, []);

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
        onConfirm={() => {
          dispatch.setPQIRToBeDeletedId(null);
          pqirToBeDeletedId &&
            selectedNodeForPQIR?.id &&
            deletePQIR.mutate({
              pqirId: pqirToBeDeletedId,
              selectedNodeId: selectedNodeForPQIR.id,
            });
        }}
        header="Delete PQIR"
        warningMessage={`Are you sure you want to delete this PQIR?\  
        It will be deleted from all the cards in the whole process`}
        confirmMessage="Delete"
      />
      <SideBar
        onClose={() => setSelectedNodeForPQIRid(undefined)}
        userCanEdit={userCanEdit}
        selectedNode={selectedNodeForPQIR?.data as NodeDataCommon}
      />
      <NetworkToast />
      <ReactFlow<Node<NodeDataFull>, Edge<CanvasEdgeData>>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeElementTypes}
        edgeTypes={edgeElementTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={() => {
          setSelectedNode(undefined);
          setSelectedNodeForPQIRid(undefined);
        }}
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
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onEdgeMouseEnter={(_, edge) => handleSetSelectedEdge(edge)}
        onEdgeMouseLeave={() => handleSetSelectedEdge(undefined)}
        connectionRadius={100}
        nodeDragThreshold={15}
        onNodeContextMenu={onNodeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        preventScrolling={selectedNode && hoveredNode?.id !== selectedNode.id}
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
            onDelete={setNodeToBeDeleted}
            onEditNode={setSelectedNode}
            canvasRef={ref}
            userCanEdit={userCanEdit}
          />
        )}
      </ReactFlow>
    </>
  );
};

export const FlowWrapper = (props: CanvasProps) => {
  return (
    <SelectedNodeForPQIRidProvider>
      <ReactFlowProvider>
        <Flow {...props} />
      </ReactFlowProvider>
    </SelectedNodeForPQIRidProvider>
  );
};
