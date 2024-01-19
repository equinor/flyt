import "reactflow/dist/style.css";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useAccount, useMsal } from "@azure/msal-react";
import { useMutation, useQueryClient } from "react-query";

import { getAccessToken } from "../../auth/msalHelpers";
import { DeleteNodeDialog } from "../DeleteNodeDialog";
import { LiveIndicator } from "../LiveIndicator";
import { io } from "socket.io-client";
import { ResetProcessButton } from "components/ResetProcessButton";
import { ToBeToggle } from "./ToBeToggle";
import { SideBar } from "../SideBar";
import { getMyAccess } from "../../utils/getMyAccess";
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
  useStore,
  ReactFlowState,
} from "reactflow";
import { setLayout } from "./hooks/useLayout";
import { nodeElementTypes } from "./NodeElementTypes";
import { NodeData, NodeDataFull } from "types/NodeData";
import {
  moveVertice,
  addVertice,
  addVerticeLeft,
  addVerticeRight,
  moveVerticeRightOfTarget,
  mergeVertices,
} from "../../services/graphApi";
import { NodeTypes } from "types/NodeTypes";
import { uid } from "../../utils/uuid";
import { Project } from "types/Project";
import { Graph } from "types/Graph";
import { validDropTarget } from "./utils/validDropTarget";
import { getQIPRContainerWidth } from "./utils/getQIPRContainerWidth";
import { CanvasTutorial } from "./CanvasTutorial/CanvasTutorial";
import { useCenterCanvas } from "./hooks/useCenterCanvas";

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
  const { id, version } = router.query;

  const [socketConnected, setSocketConnected] = useState(false);
  const [socketReason, setSocketReason] = useState("");

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const shapeSize = { height: 140, width: 140 };

  let tempNodes: Node<NodeDataFull>[] = [];
  let tempEdges: Edge[] = [];
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeDataFull>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const dragRef = useRef<Node<NodeData> | null>(null);
  const [source, setSource] = useState<Node<NodeDataFull> | undefined>(
    undefined
  );
  const [target, setTarget] = useState<Node<NodeDataFull> | undefined>(
    undefined
  );

  const [visibleDeleteScrim, setVisibleDeleteScrim] = useState(false);
  const [visibleLabelScrim, setVisibleLabelScrim] = useState(false);
  const myAccess = getMyAccess(project, account);
  const userCanEdit = !version && myAccess !== "Reader";

  const queryClient = useQueryClient();
  const projectId = router.query.id as string;

  const connectionNodeIdSelector = (state: ReactFlowState) =>
    state.connectionNodeId;
  const connectionNodeId = useStore(connectionNodeIdSelector);

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

      socket.on(`room-${id}`, (payload) => {
        if (payload.user !== account.username?.split("@")[0]) {
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

  useEffect(() => {
    if (connectionNodeId) {
      handleMergeInit(connectionNodeId);
    } else {
      handleMergeCancel();
    }
  }, [connectionNodeId]);

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
        id && notifyOthers("Merged cards", id, account);
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
        notifyOthers("Added a new card", id, account);
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const handleMoveNode = useMutation(
    ({
      nodeId,
      targetId,
      position,
      includeChildren,
    }: {
      nodeId: string;
      targetId: string;
      position: Position;
      includeChildren: boolean;
    }) => {
      dispatch.setSnackMessage("⏳ Moving card...");
      return position === Position.Bottom
        ? moveVertice(
            { vertexToMoveId: nodeId, vertexDestinationParentId: targetId },
            projectId,
            includeChildren
          )
        : moveVerticeRightOfTarget({ vertexId: nodeId }, targetId, projectId);
    },
    {
      onSuccess: () => {
        dispatch.setSnackMessage("✅ Moved card!");
        id && notifyOthers("Moved a card", id, account);
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const handleMergeInit = (nodeId: string) => {
    const sourceNode = nodes.find((node) => node.id === nodeId);
    setNodes((nodes) =>
      nodes.map((node) => {
        node.data = {
          ...node.data,
          mergeOption:
            sourceNode &&
            sourceNode.id !== node.id &&
            node.data.columnId == sourceNode?.data?.columnId &&
            !sourceNode.data.children.find((childId) => childId === node.id) &&
            !sourceNode.data.parents.find((parentId) => parentId === node.id),
        };
        node.data.merging = true;
        return node;
      })
    );
  };

  const handleMergeCancel = () => {
    setNodes((nodes) =>
      nodes.map((node) => {
        node.data = { ...node.data, mergeOption: false, merging: false };
        return node;
      })
    );
  };

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
          merging: !!connectionNodeId,
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
    const rootNode = tempNodes.find((node) => node.type === "Root");
    rootNode.data.children.forEach((childId) => {
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

  const onNodeDragStart = (
    evt: MouseEvent<Element>,
    nodeDragging: Node<NodeData>
  ) => {
    dragRef.current = nodeDragging;
    setNodes((nodes) =>
      nodes.map((node) => {
        node.data = {
          ...node.data,
          isValidDropTarget: validDropTarget(nodeDragging, node),
        };
        return node;
      })
    );
    setSource(nodeDragging);
  };

  const onNodeDrag = (evt: MouseEvent, node: Node<NodeDataFull>) => {
    const centerX = node.position.x + node.width / 2;
    const centerY = node.position.y + node.height / 2;

    const targetNode = nodes.find(
      (n) =>
        centerX > n.position.x &&
        centerX < n.position.x + node.width &&
        centerY > n.position.y &&
        centerY < n.position.y + node.height &&
        n.id !== node.id
    );

    setTarget(targetNode);
  };

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) => {
        node.data = {
          ...node.data,
          isDropTarget: node.id === target?.id && validDropTarget(node, target),
        };
        return node;
      })
    );
  }, [target]);

  const onNodeDragStop = (evt: MouseEvent, node: Node<NodeData>) => {
    if (target && validDropTarget(node, target)) {
      handleMoveNode.mutate({
        nodeId: node.id,
        targetId: target.id,
        position:
          node.type === NodeTypes.mainActivity &&
          target.type === NodeTypes.mainActivity
            ? Position.Right
            : Position.Bottom,
        includeChildren:
          target.data.children.length === 0 ||
          node?.data?.type === NodeTypes.choice,
      });
      setTarget(undefined);
      dragRef.current = null;
    }
    setNodes((nodes) =>
      nodes.map((n) => {
        n.data = { ...n.data, isValidDropTarget: null };
        if (n.id === node?.id && source) {
          n = source;
        }
        return n;
      })
    );
  };

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
