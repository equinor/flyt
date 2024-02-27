import "reactflow/dist/style.css";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";

import { getAccessToken } from "../../auth/msalHelpers";
import { DeleteNodeDialog } from "../DeleteNodeDialog";
import { LiveIndicator } from "../LiveIndicator";
import { io } from "socket.io-client";
import { ResetProcessButton } from "components/ResetProcessButton";
import { ToBeToggle } from "./ToBeToggle";
import { SideBar } from "../SideBar";
import { notifyOthers } from "../../services/notifyOthers";
import { CanvasButtons } from "components/CanvasButtons";
import { ManageLabelBox } from "components/Labels/ManageLabelBox";
import { unknownErrorToString } from "utils/isError";
import { useRouter } from "next/router";
import { useStoreDispatch } from "../../hooks/storeHooks";
import { NodeDataApi } from "types/NodeDataApi";
import styles from "./Canvas.module.scss";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Edge,
  Node,
  Position,
  Controls,
} from "reactflow";
import { setLayout } from "./hooks/useLayout";
import { nodeElementTypes } from "./NodeElementTypes";
import { NodeDataFull } from "types/NodeData";
import {
  addVertice,
  addVerticeLeft,
  addVerticeRight,
  mergeVertices,
} from "../../services/graphApi";
import { NodeTypes } from "types/NodeTypes";
import { uid } from "../../utils/uuid";
import { Project } from "types/Project";
import { Graph } from "types/Graph";
import { getQIPRContainerWidth } from "./utils/getQIPRContainerWidth";
import { CanvasTutorial } from "./CanvasTutorial/CanvasTutorial";
import { useCenterCanvas } from "./hooks/useCenterCanvas";
import { useAccess } from "./hooks/useAccess";
import { useUserAccount } from "./hooks/useUserAccount";
import { useNodeDrag } from "./hooks/useNodeDrag";
import { useNodeMerge } from "./hooks/useNodeMerge";
import { OldFlytButton } from "./OldFlytButton";

type CanvasProps = {
  graph: Graph;
  project: Project;
};

const Canvas = ({ graph, project }: CanvasProps) => {
  const [selectedNode, setSelectedNode] = useState<NodeDataApi | undefined>(
    undefined
  );
  const dispatch = useStoreDispatch();
  const router = useRouter();

  const account = useUserAccount();
  const { userCanEdit } = useAccess(project);

  const [socketConnected, setSocketConnected] = useState(false);
  const [socketReason, setSocketReason] = useState("");

  const shapeSize = { height: 140, width: 140 };
  const createdBeforeSecondMajorRelease =
    project.created < "2024-01-01T00:00:00.0384589+00:00";

  let tempNodes: Node<NodeDataFull>[] = [];
  let tempEdges: Edge[] = [];
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeDataFull>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [visibleDeleteScrim, setVisibleDeleteScrim] = useState(false);
  const [visibleLabelScrim, setVisibleLabelScrim] = useState(false);

  const queryClient = useQueryClient();
  const projectId = router.query.id as string;

  const { onNodeDragStart, onNodeDrag, onNodeDragStop } = useNodeDrag();
  const { merging } = useNodeMerge();

  useEffect(() => {
    getAccessToken().then((accessToken) => {
      const socket = io({ path: "/api/socket", auth: { token: accessToken } });

      socket.on("connect", () => {
        setSocketConnected(true);
      });

      socket.on("disconnect", (reason) => {
        dispatch.setSnackMessage(`Socket disconnected because ${reason}`);
        setSocketConnected(false);
        setSocketReason(`${reason}`);
      });

      socket.on("connect_error", (error) => {
        // if (error.data.type === "UnauthorizedError") {
        console.log("Error", error);
        setSocketConnected(false);
        setSocketReason(error.message);
        // }
      });

      socket.on(`room-${projectId}`, (payload) => {
        if (payload.user !== account?.username?.split("@")[0]) {
          dispatch.setSnackMessage(
            `${payload.user ? payload.user : "Someone"} ${payload.msg}`
          );
        }
        queryClient.invalidateQueries();
      });
      // Handling token expiration

      return () => socket.disconnect();
    });
  }, []);

  const handleMerge = useMutation(
    ({
      sourceId,
      targetId,
    }: {
      sourceId: string | null;
      targetId: string | null;
    }) => {
      if (!sourceId || !targetId) {
        throw new Error("Could not connect nodes");
      }
      dispatch.setSnackMessage("⏳ Merging cards...");
      return mergeVertices(
        { fromVertexId: sourceId, toVertexId: targetId },
        projectId
      );
    },
    {
      onSuccess: () => {
        dispatch.setSnackMessage("✅ Cards merged!");
        projectId && notifyOthers("Merged cards", projectId, account);
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const handleClickAddNode = useMutation(
    ({
      parentId,
      type,
      position,
    }: {
      parentId: string;
      type: NodeTypes;
      position: Position;
    }) => {
      dispatch.setSnackMessage("⏳ Adding new card...");
      switch (position) {
        case Position.Left:
          return addVerticeLeft({ type }, projectId, parentId);
        case Position.Right:
          return addVerticeRight({ type }, projectId, parentId);
        default:
          return addVertice({ type }, projectId, parentId);
      }
    },
    {
      onSuccess: () => {
        dispatch.setSnackMessage("✅ Card added!");
        notifyOthers("Added a new card", projectId, account);
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

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

      tempEdges.push({
        id: `${parent.id}=>${node.id}`,
        source: parent.id,
        target: node.id,
      });

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
            handleClickAddNode.mutate({ parentId: id, type, position }),
          handleMerge: (sourceId, targetId) =>
            sourceId && targetId && handleMerge.mutate({ sourceId, targetId }),
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
      const childNode = graph.find((node) => node.id === childId);
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
            tempParentNode &&
            depthDeepestNode &&
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
        if (nodeDuplicate?.data?.depth <= parentDepth) {
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
        setSingleNodeDepth(child, data.depth);
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
          setSingleNodeDepth(child, node.data.depth);
        });
      });
    }
  };

  useEffect(() => {
    const root = graph.find(
      (node: NodeDataApi) => node.type === NodeTypes.root
    );
    if (root) {
      if (selectedNode) {
        const updatedSelectedNode = graph.find(
          (node) => node.id === selectedNode.id
        );
        updatedSelectedNode && setSelectedNode(updatedSelectedNode);
      }
      createNodes(root);
      setNodesDepth();
      createHiddenNodes();
      const finalNodes = setLayout(tempNodes, tempEdges);
      setNodes(finalNodes);
      setEdges(tempEdges);
    }
  }, [graph, userCanEdit]);

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
          !!socketConnected
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
        <Controls className={styles.controls} showInteractive={false} />
      </ReactFlow>
      <CanvasTutorial />
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
    </ReactFlowProvider>
  );
}
