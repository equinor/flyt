import { CanvasButtons } from "components/CanvasButtons";
import { ManageLabelBox } from "components/Labels/ManageLabelBox";
import { ResetProcessButton } from "components/ResetProcessButton";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactFlow, {
  ControlButton,
  Controls,
  Edge,
  Node,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { NodeData, NodeDataFull } from "types/NodeData";
import { NodeDataApi } from "types/NodeDataApi";
import { NodeTypes } from "types/NodeTypes";
import { Project } from "types/Project";
import { Graph } from "@/types/Graph";
import { DeleteNodeDialog } from "../DeleteNodeDialog";
import { LiveIndicator } from "../LiveIndicator";
import { SideBar } from "../SideBar";
import styles from "./Canvas.module.scss";
import { nodeElementTypes } from "./NodeElementTypes";
import { ToBeToggle } from "./ToBeToggle";
import { useAccess } from "./hooks/useAccess";
import { useCenterCanvas } from "./hooks/useCenterCanvas";
import { setLayout } from "./hooks/useLayout";
import { useNodeDrag } from "./hooks/useNodeDrag";
import { useNodeMerge } from "./hooks/useNodeMerge";
import { useWebSocket } from "./hooks/useWebSocket";
import { getQIPRContainerWidth } from "./utils/getQIPRContainerWidth";
import { setMainActivitiesDurationSum } from "./utils/setMainActivitiesDurationSum";
import { useEdgeDelete } from "./hooks/useEdgeDelete";
import { ScrimDelete } from "../ScrimDelete";
import { MiniMapCustom } from "@/components/canvas/MiniMapCustom";
import { ZoomLevel } from "@/components/canvas/ZoomLevel";
import { edgeElementTypes } from "@/components/canvas/EdgeElementTypes";
import { createHiddenNodes } from "@/components/canvas/utils/createHiddenNodes";
import { createEdges } from "./utils/createEdges";
import { useCopyPaste } from "./hooks/useCopyPaste";
import { copyPasteNodeValidator } from "./utils/copyPasteValidators";
import { useNodeAdd } from "./hooks/useNodeAdd";
import { useContextMenu } from "./hooks/useContextMenu";
import { ContextMenu } from "./ContextMenu";
import { nodeValidityMap } from "./utils/nodeValidityHelper";
import { handlePasteNode } from "./utils/handlePasteNode";

type CanvasProps = {
  graph: Graph;
  project: Project;
};

const Canvas = ({
  graph: { vertices: apiNodes, edges: apiEdges },
  project,
}: CanvasProps) => {
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | undefined>(
    undefined
  );
  const [hoveredNode, setHoveredNode] = useState<Node<NodeData> | undefined>(
    undefined
  );
  const { userCanEdit } = useAccess(project);
  const { addNode } = useNodeAdd();
  const ref = useRef<HTMLDivElement>(null);

  const shapeSize = { height: 140, width: 140 };

  let tempNodes: Node<NodeData>[] = [];
  const tempEdges: Edge[] = apiEdges.map((e) => ({ ...e, label: e.edgeValue }));

  const [isEditingEdgeText, setIsEditingEdgeText] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeDataFull>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [nodeToBeDeleted, setNodeToBeDeleted] = useState<
    Node<NodeData> | undefined
  >(undefined);
  const [edgeToBeDeletedId, setEdgeToBeDeletedId] = useState<
    string | undefined
  >(undefined);
  const [visibleLabelScrim, setVisibleLabelScrim] = useState(false);
  const isEditingEdge = isEditingEdgeText || edgeToBeDeletedId;

  const { onNodeDragStart, onNodeDrag, onNodeDragStop } = useNodeDrag();
  const { mutate: mergeNode, merging } = useNodeMerge();
  const { deleteEdgeMutation } = useEdgeDelete();
  const { menuData, onNodeContextMenu, onPaneContextMenu, closeContextMenu } =
    useContextMenu(ref);

  useEffect(() => {
    !menuData && setHoveredNode(undefined);
  }, [menuData]);

  const { socketConnected, socketReason } = useWebSocket();
  const { copyToClipboard, paste } = useCopyPaste(
    hoveredNode,
    (node: Node<NodeData>) =>
      handlePasteNode(node, hoveredNode, nodes, addNode),
    copyPasteNodeValidator
  );

  let columnId: string | null = null;

  const handleSetSelectedNode = (id?: string) => {
    const node = tempNodes.find((n) => n.id === id);
    node && setSelectedNode(node as Node<NodeData>);
  };

  const createNodes = (
    node: NodeDataApi,
    parent: NodeDataApi | null = null
  ) => {
    if (parent) {
      if (
        node.type === NodeTypes.mainActivity ||
        node.type === NodeTypes.output ||
        node.type === NodeTypes.supplier ||
        node.type === NodeTypes.input ||
        node.type === NodeTypes.customer
      ) {
        columnId = node.id;
      }

      const duplicateNode = tempNodes.find(
        (tempNode) => tempNode.id === node.id
      );

      if (duplicateNode) {
        tempNodes = tempNodes.map((tempNode) => {
          const newData = tempNode.data;
          if (tempNode.id === node.id) {
            newData.parents.push(parent.id);
            if (parent.type === NodeTypes.choice) {
              newData.isChoiceChild = true;
            }
            return { ...tempNode, data: newData };
          }
          return tempNode;
        });
        return;
      }

      tempNodes.push({
        id: node.id,
        data: {
          ...node,
          handleClickNode: () => handleSetSelectedNode(node.id),
          handleMerge: (sourceId, targetId) =>
            sourceId && targetId && mergeNode.mutate({ sourceId, targetId }),
          mergeable:
            node.children.length === 0 || node.type === NodeTypes.choice,
          merging: merging,
          deletable: nodeValidityMap[node.type].deletable,
          copyable: nodeValidityMap[node.type].copyable,
          parents: [parent.id],
          userCanEdit,
          isChoiceChild: parent.type === NodeTypes.choice,
          columnId,
          shapeHeight: shapeSize.height,
          shapeWidth: shapeSize.width,
        },
        position: { x: 0, y: 0 },
        type: node.type,
        height: shapeSize.height,
        width: shapeSize.width + getQIPRContainerWidth(node.tasks),
        deletable: false,
      });
    } else {
      tempNodes.push({
        id: node.id,
        data: {
          ...node,
          deletable: nodeValidityMap[node.type].deletable,
          copyable: nodeValidityMap[node.type].copyable,
          parents: [],
          columnId: node.id,
          shapeHeight: shapeSize.height,
          shapeWidth: shapeSize.width,
        },
        position: { x: 0, y: 0 },
        type: node.type,
        height: shapeSize.height,
        width: shapeSize.width + getQIPRContainerWidth(node.tasks),
        deletable: false,
      });
    }

    node.children.forEach((childId) => {
      const childNode = apiNodes.find((node) => node.id === childId);
      childNode && createNodes(childNode, node);
    });
  };

  const handleSetSelectedEdge = (selectedEdge: Edge | undefined) => {
    if (userCanEdit && !isEditingEdge) {
      const updatedEdges = edges.map((e) => {
        e.selected = e.id === selectedEdge?.id;
        return e;
      });
      setEdges(updatedEdges);
    }
  };

  const mergedNodesLooping = new Map<string, [Node<NodeDataFull>, number]>();
  let mergedNodesReady: Node<NodeDataFull>[] = [];

  const setSingleNodeDepth = (nodeId: string, parentDepth: number) => {
    const node = tempNodes.find((node) => node.id === nodeId);
    if (!node) return;
    const { data } = node;

    if (data?.parents?.length > 1) {
      if (mergedNodesLooping.has(nodeId)) {
        const nodeDuplicate = mergedNodesLooping.get(nodeId)![0];
        const loopCount = mergedNodesLooping.get(nodeId)![1];
        if (
          nodeDuplicate.data.depth &&
          nodeDuplicate.data.depth <= parentDepth
        ) {
          nodeDuplicate.data.depth = parentDepth + 1;
        }
        mergedNodesLooping.set(nodeId, [nodeDuplicate, loopCount + 1]);
        if (nodeDuplicate?.data?.parents?.length === loopCount + 1) {
          mergedNodesReady.push(nodeDuplicate);
          mergedNodesLooping.delete(nodeId);
        }
      } else {
        mergedNodesLooping.set(nodeId, [node, 1]);
        data.depth = parentDepth + 1;
      }
    } else {
      data.depth = parentDepth + 1;
      data?.children?.forEach((child) => {
        if (data.depth) setSingleNodeDepth(child, data.depth);
      });
    }
  };

  const setNodesDepth = () => {
    const rootNode = tempNodes.find((node) => node.type === NodeTypes.root);
    rootNode?.data.children.forEach((childId) => {
      setSingleNodeDepth(childId, 0);
    });
    while (mergedNodesReady.length > 0) {
      const dupeMergedNodesReady = mergedNodesReady;
      mergedNodesReady = [];
      dupeMergedNodesReady.forEach((node) => {
        node.data.children.forEach((child) => {
          if (node.data.depth) setSingleNodeDepth(child, node.data.depth);
        });
      });
    }
  };

  useLayoutEffect(() => {
    const root = apiNodes.find(
      (node: NodeDataApi) => node.type === NodeTypes.root
    );

    if (!root) {
      setNodes([]);
      setEdges([]);
      return;
    }

    createNodes(root);
    tempNodes = setMainActivitiesDurationSum(tempNodes);
    setNodesDepth();
    const {
      tempNodes: tempWithHiddenNodes,
      tempEdges: tempWithHiddenEdges,
      longEdges,
    } = createHiddenNodes(tempNodes, tempEdges, shapeSize);
    const finalNodes = setLayout(tempWithHiddenNodes, tempWithHiddenEdges);
    const finalEdges = createEdges(
      finalNodes,
      tempWithHiddenEdges,
      longEdges,
      shapeSize,
      userCanEdit,
      setIsEditingEdgeText,
      setEdgeToBeDeletedId
    );
    setNodes(finalNodes);
    setEdges(finalEdges);

    selectedNode && handleSetSelectedNode(selectedNode.id);
  }, [apiNodes, apiEdges, userCanEdit]);

  const { centerCanvas } = useCenterCanvas();

  return (
    <>
      <CanvasButtons
        userCanEdit={userCanEdit}
        handleClickLabel={() => setVisibleLabelScrim(true)}
      />
      <ManageLabelBox
        handleClose={() => setVisibleLabelScrim(false)}
        isVisible={visibleLabelScrim}
        process={project}
      />
      <LiveIndicator
        live={socketConnected}
        title={
          socketConnected
            ? "Connection is looking good!\nYour changes should appear immediately for other users."
            : `You are not connected${
                socketReason ? " because of ${socketReason}" : ""
              }.`
        }
      />
      <ToBeToggle />
      <ResetProcessButton />
      {nodeToBeDeleted && (
        <DeleteNodeDialog
          objectToDelete={nodeToBeDeleted.data}
          onClose={() => {
            setNodeToBeDeleted(undefined);
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
        onDelete={() => setNodeToBeDeleted(selectedNode)}
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
        onMoveStart={() => closeContextMenu()}
        minZoom={0.2}
        nodesDraggable={userCanEdit}
        nodesConnectable={true}
        zoomOnDoubleClick={false}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
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
        attributionPosition="bottom-right"
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

export function CanvasWrapper(props: CanvasProps) {
  return (
    <ReactFlowProvider>
      <Canvas {...props} />
    </ReactFlowProvider>
  );
}
