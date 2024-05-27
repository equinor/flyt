import { CanvasButtons } from "components/CanvasButtons";
import { ManageLabelBox } from "components/Labels/ManageLabelBox";
import { ResetProcessButton } from "components/ResetProcessButton";
import { useLayoutEffect, useState } from "react";
import ReactFlow, {
  BaseEdge,
  Controls,
  Edge,
  Node,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { NodeDataFull } from "types/NodeData";
import { NodeDataApi } from "types/NodeDataApi";
import { NodeTypes } from "types/NodeTypes";
import { Project } from "types/Project";
import { Graph } from "@/types/Graph";
import { uid } from "@/utils/uuid";
import { DeleteNodeDialog } from "../DeleteNodeDialog";
import { LiveIndicator } from "../LiveIndicator";
import { SideBar } from "../SideBar";
import styles from "./Canvas.module.scss";
import { nodeElementTypes } from "./NodeElementTypes";
import { OldFlytButton } from "./OldFlytButton";
import { ToBeToggle } from "./ToBeToggle";
import { useAccess } from "./hooks/useAccess";
import { useCenterCanvas } from "./hooks/useCenterCanvas";
import { setLayout } from "./hooks/useLayout";
import { useNodeAdd } from "./hooks/useNodeAdd";
import { useNodeDrag } from "./hooks/useNodeDrag";
import { useNodeMerge } from "./hooks/useNodeMerge";
import { useWebSocket } from "./hooks/useWebSocket";
import { getQIPRContainerWidth } from "./utils/getQIPRContainerWidth";
import { useProjectId } from "@/hooks/useProjectId";
import { MiniMapCustom } from "@/components/canvas/MiniMapCustom";
import { EdgeDataApi } from "@/types/EdgeDataApi";
import { ChoiceEdge } from "@/components/canvas/ChoiceEdge";

type CanvasProps = {
  graph: Graph;
  project: Project;
};

const Canvas = ({
  graph: { vertices: apiNodes, edges: apiEdges },
  project,
}: CanvasProps) => {
  const [selectedNode, setSelectedNode] = useState<NodeDataApi | undefined>(
    undefined
  );
  const { projectId } = useProjectId();
  const { userCanEdit } = useAccess(project);

  const shapeSize = { height: 140, width: 140 };
  const createdBeforeSecondMajorRelease =
    new Date(project.created).getTime() <
    new Date("2024-04-24T00:08:00.000000Z").getTime();

  let tempNodes: Node<NodeDataFull>[] = [];
  let tempEdges: Edge[] = [];
  apiEdges.map((edge: EdgeDataApi) => {
    const nodeSource = apiNodes.filter((node) => node.id === edge.source);
    if (nodeSource[0] && nodeSource[0].type === NodeTypes.choice) {
      tempEdges.push({ ...edge, type: "choice" });
    } else {
      tempEdges.push({ ...edge });
    }
  });

  const [nodes, setNodes, onNodesChange] = useNodesState<NodeDataFull>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const edgeTypes = {
    choice: ChoiceEdge,
  };

  const [visibleDeleteScrim, setVisibleDeleteScrim] = useState(false);
  const [visibleLabelScrim, setVisibleLabelScrim] = useState(false);

  const { onNodeDragStart, onNodeDrag, onNodeDragStop } = useNodeDrag();
  const { mutate: mergeNode, merging } = useNodeMerge();
  const { mutate: addNode } = useNodeAdd();

  const { socketConnected, socketReason } = useWebSocket();

  let columnId: string | null = null;

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
          handleClickNode: () => setSelectedNode(node),
          handleClickAddNode: (id, type, position) =>
            addNode({ parentId: id, type, position }),
          handleMerge: (sourceId, targetId) =>
            sourceId && targetId && mergeNode.mutate({ sourceId, targetId }),
          mergeable:
            node.children.length === 0 || node.type === NodeTypes.choice,
          merging: merging,
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
      });
    } else {
      tempNodes.push({
        id: node.id,
        data: {
          ...node,
          parents: [],
          columnId: node.id,
        },
        position: { x: 0, y: 0 },
        type: node.type,
        height: shapeSize.height,
        width: shapeSize.width + getQIPRContainerWidth(node.tasks),
      });
    }

    node.children.forEach((childId) => {
      const childNode = apiNodes.find((node) => node.id === childId);
      childNode && createNodes(childNode, node);
    });
  };

  const createHiddenNodes = () => {
    tempNodes.forEach((node) => {
      if (node?.data?.parents?.length > 1) {
        let depthDeepestNode: undefined | number = undefined;
        node?.data?.parents?.forEach((parentNodeId) => {
          const parentNode = tempNodes.find((node) => node.id === parentNodeId);
          if (
            parentNode?.data?.depth &&
            (!depthDeepestNode || parentNode?.data?.depth > depthDeepestNode)
          )
            depthDeepestNode = parentNode.data.depth;
        });
        node?.data?.parents?.forEach((parentNodeId) => {
          const tempParentNode = tempNodes.find(
            (node) => node.id === parentNodeId
          );
          if (
            depthDeepestNode &&
            tempParentNode?.data.depth &&
            tempParentNode.data.depth < depthDeepestNode
          ) {
            tempEdges = tempEdges.filter(
              (edge) =>
                edge.source !== tempParentNode.id || edge.target !== node.id
            );
            let tempParentNodeId = tempParentNode.id;
            for (let i = tempParentNode.data.depth; i < depthDeepestNode; i++) {
              const id = uid();
              tempNodes.push({
                id,
                data: {
                  parents: [tempParentNodeId],
                  columnId: tempParentNode.data.columnId,
                  depth: i,
                  children: [],
                  shapeHeight: shapeSize.height,
                  shapeWidth: shapeSize.width,
                },
                position: { x: 0, y: 0 },
                type: NodeTypes.hidden,
                height: shapeSize.height,
                width: shapeSize.width,
                draggable: false,
                selectable: false,
              });
              tempEdges.push({
                id: `${tempParentNodeId}=>${id}`,
                source: tempParentNodeId,
                target: id,
              });
              tempEdges.push({
                id: `${id}=>${id}`,
                source: id,
                target: id,
                type: "straight",
              });
              tempParentNodeId = id;
            }

            tempEdges.push({
              id: `${tempParentNodeId}=>${node.id}`,
              source: tempParentNodeId,
              target: node.id,
            });
          }
        });
      }
    });
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

    if (selectedNode) {
      const updatedSelectedNode = apiNodes.find(
        (node) => node.id === selectedNode.id
      );
      setSelectedNode(updatedSelectedNode);
    }
    createNodes(root);
    setNodesDepth();
    createHiddenNodes();
    const finalNodes = setLayout(tempNodes, tempEdges);
    setNodes(finalNodes);
    setEdges(tempEdges);
  }, [apiNodes, apiEdges, userCanEdit]);

  useCenterCanvas();

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
      {selectedNode && (
        <DeleteNodeDialog
          objectToDelete={selectedNode}
          visible={visibleDeleteScrim}
          onClose={() => {
            setVisibleDeleteScrim(false);
            setSelectedNode(undefined);
          }}
        />
      )}
      <SideBar
        onClose={() => setSelectedNode(undefined)}
        onDelete={() => setVisibleDeleteScrim(true)}
        canEdit={userCanEdit}
        selectedNode={selectedNode}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeElementTypes}
        edgeTypes={edgeTypes}
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
        attributionPosition="bottom-right"
        connectionRadius={100}
      >
        <MiniMapCustom />
      </ReactFlow>
      {createdBeforeSecondMajorRelease && (
        <OldFlytButton projectId={projectId} />
      )}
    </>
  );
};

export function CanvasWrapper(props: CanvasProps) {
  return (
    <ReactFlowProvider>
      <Canvas {...props} />
      <Controls className={styles.controls} showInteractive={false} />
    </ReactFlowProvider>
  );
}
