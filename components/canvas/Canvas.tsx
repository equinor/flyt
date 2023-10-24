import "reactflow/dist/style.css";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useAccount, useMsal } from "@azure/msal-react";
import { useMutation, useQueryClient } from "react-query";

import { getAccessToken } from "../../auth/msalHelpers";
import { DeleteVsmObjectDialog } from "../DeleteVsmObjectDialog";
import { LiveIndicator } from "../LiveIndicator";
import { io } from "socket.io-client";
import { ResetProcessButton } from "components/ResetProcessButton";
import { ToBeToggle } from "./ToBeToggle";
import { VSMSideBar } from "../VSMSideBar";
import { getMyAccess } from "../../utils/getMyAccess";
import { notifyOthers } from "../../services/notifyOthers";
import { CanvasButtons } from "components/CanvasButtons";
import { ManageLabelBox } from "components/Labels/ManageLabelBox";
import { unknownErrorToString } from "utils/isError";
import { useRouter } from "next/router";
import { useStoreDispatch } from "../../hooks/storeHooks";
import { vsmObject } from "types/VsmObject";
import { Button, Icon } from "@equinor/eds-core-react";
import { close } from "@equinor/eds-icons";
import { ProcessTimeline } from "../ProcessTimeline";
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
import { nodeTypes } from "./NodeTypes";
import { NodeData, NodeDataFull } from "types/NodeData";
import {
  moveVertice,
  addVertice,
  addVerticeLeft,
  addVerticeRight,
  moveVerticeRightOfTarget,
  mergeVertices,
} from "../../services/graphApi";
import { vsmObjectTypes } from "types/vsmObjectTypes";
import { getQIPRContainerWidth } from "./utils/getQIPRContainerWidth";
import { uid } from "../../utils/uuid";
import { vsmProject } from "types/VsmProject";
import { Graph } from "types/Graph";
import { validDropTarget } from "./utils/validDropTarget";
import { setNodesDepth } from "./utils/setNodesDepth";

type CanvasProps = {
  project: vsmProject;
  graph: Graph;
};

function Canvas({ graph, project }: CanvasProps): JSX.Element {
  const [selectedObject, setSelectedObject] = useState<vsmObject | undefined>(
    undefined
  );
  const dispatch = useStoreDispatch();
  const router = useRouter();
  const { id, version } = router.query;

  const [socketConnected, setSocketConnected] = useState(false);
  const [socketReason, setSocketReason] = useState("");

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  let initNodes: Node<NodeDataFull>[] = [];
  let initEdges: Edge[] = [];
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeDataFull>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const nodeWidth = 200;
  const nodeHeight = 200;

  const dragRef = useRef<Node<NodeData> | null>(null);
  const [target, setTarget] = useState<Node<NodeDataFull> | undefined>(
    undefined
  );
  const [source, setSource] = useState<Node<NodeDataFull> | undefined>(
    undefined
  );

  const [visibleDeleteScrim, setVisibleDeleteScrim] = useState(false);
  const [visibleLabelScrim, setVisibleLabelScrim] = useState(false);
  const myAccess = getMyAccess(project, account);
  const userCanEdit = !version && myAccess !== "Reader";

  const queryClient = useQueryClient();
  const projectId = router.query.id as string;
  const [showVersionHistoryBottomSheet, setShowVersionHistoryBottomSheet] =
    useState(!!router.query.version);

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
        if (payload.user !== account?.username.split("@")[0]) {
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

  function goToCurrentVersion(): void {
    // navigate back to current version
    router.replace(`/process/${projectId}`);
  }

  function closeVersionHistoryBottomSheet(): void {
    setShowVersionHistoryBottomSheet(false);
    goToCurrentVersion();
  }

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
        id && notifyOthers("Added a new card", id, account);
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const handleClickAddCard = useMutation(
    ({
      parentId,
      type,
      position,
    }: {
      parentId: string;
      type: string;
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

  const handleMoveCard = useMutation(
    ({
      cardId,
      targetId,
      position,
      includeChildren,
    }: {
      cardId: string;
      targetId: string;
      position: Position;
      includeChildren: boolean;
    }) => {
      dispatch.setSnackMessage("⏳ Moving card...");
      return position === Position.Bottom
        ? moveVertice(
            { vertexToMoveId: cardId, vertexDestinationParentId: targetId },
            projectId,
            includeChildren
          )
        : moveVerticeRightOfTarget({ vertexId: cardId }, targetId, projectId);
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

  const handleMergeInit = (nodeId: string): void => {
    const initNode = nodes.find((node) => node.id === nodeId);
    setNodes((nodes) =>
      nodes.map((node) => {
        if (
          initNode &&
          initNode.id !== node.id &&
          node.data.columnId == initNode?.data?.columnId &&
          !initNode.data.children.find((childId) => childId === node.id) &&
          !initNode.data.parentCardIDs.find((parentId) => node.id === parentId)
        ) {
          node.data = { ...node.data, mergeOption: true };
        } else {
          node.data = {
            ...node.data,
            mergeOption: false,
          };
        }
        node.data.merging = true;
        return node;
      })
    );
  };

  const handleMergeCancel = (): void => {
    setNodes((nodes) =>
      nodes.map((node) => {
        node.data = { ...node.data, mergeOption: false, merging: false };
        return node;
      })
    );
  };

  let columnId: string | null = null;

  const createNodes = (
    card: vsmObject,
    parentCard: vsmObject | null = null
  ): void => {
    if (parentCard) {
      if (
        card.type === vsmObjectTypes.mainActivity ||
        card.type === vsmObjectTypes.output ||
        card.type === vsmObjectTypes.supplier ||
        card.type === vsmObjectTypes.input ||
        card.type === vsmObjectTypes.customer
      ) {
        columnId = card.id;
      }

      initEdges.push({
        id: `${parentCard.id}=>${card.id}`,
        source: parentCard.id,
        target: card.id,
      });

      // Occurs when a node has multiple parents
      const duplicateNode = initNodes.find((node) => node.id === card.id);

      if (duplicateNode) {
        initNodes = initNodes.map((node: Node) => {
          const newData = node.data;
          if (node.id === card.id) {
            newData.parentCardIDs.push(parentCard.id);
            return { ...node, data: newData };
          }
          return node;
        });
        return;
      }

      initNodes.push({
        id: card.id,
        data: {
          ...card,
          handleClickCard: () => setSelectedObject(card),
          handleClickAddCard: (id, type, position) =>
            handleClickAddCard.mutate({ parentId: id, type, position }),
          handleMerge: (sourceId, targetId) =>
            sourceId && targetId && handleMerge.mutate({ sourceId, targetId }),
          mergeable:
            card.children.length === 0 || card.type === vsmObjectTypes.choice,
          merging: !!connectionNodeId,
          parentCardIDs: [parentCard.id],
          userCanEdit,
          isChoiceChild: parentCard.type === vsmObjectTypes.choice,
          columnId,
        },
        position: { x: 0, y: 0 },
        type: card.type,
        width:
          nodeWidth +
          getQIPRContainerWidth(
            card?.tasks?.filter((task) => !task.solved).length
          ),
        height: nodeHeight,
      });
    } else {
      initNodes.push({
        id: card.id,
        data: {
          ...card,
          parentCardIDs: [],
          columnId: card.id,
        },
        position: { x: 0, y: 0 },
        type: card.type,
        width: nodeWidth,
        height: nodeHeight,
      });
    }

    card.children.forEach((childCardId) => {
      const childCard = graph.find(
        (card: vsmObject) => card.id === childCardId
      );
      childCard && createNodes(childCard, card);
    });
  };

  const createFillerNodes = () => {
    initNodes.forEach((node) => {
      if (node?.data?.parentCardIDs?.length > 1) {
        let depthDeepestCard: undefined | number = undefined;
        node?.data?.parentCardIDs?.forEach((parentCardID) => {
          const parentCard = initNodes.find((node) => node.id === parentCardID);
          if (
            parentCard?.data?.depth &&
            (!depthDeepestCard || parentCard?.data?.depth > depthDeepestCard)
          )
            depthDeepestCard = parentCard.data.depth;
        });
        node?.data?.parentCardIDs?.forEach((parentCardID) => {
          const parentCard = initNodes.find((node) => node.id === parentCardID);
          if (
            parentCard &&
            depthDeepestCard &&
            parentCard.data.depth < depthDeepestCard
          ) {
            initEdges = initEdges.filter(
              (edge) => edge.source !== parentCard.id || edge.target !== node.id
            );
            let parentId = parentCard.id;
            for (let i = parentCard.data.depth; i < depthDeepestCard; i++) {
              const id = uid();
              initNodes.push({
                id,
                data: {
                  parentCardIDs: [parentId],
                  columnId: parentCard.data.columnId,
                  depth: i,
                  //TODO: Add children
                  children: [],
                },
                position: { x: 0, y: 0 },
                type: vsmObjectTypes.empty,
                width: nodeWidth,
                height: nodeHeight,
                draggable: false,
                selectable: false,
              });
              initEdges.push({
                id: `${parentId}=>${id}`,
                source: parentId,
                target: id,
                type: "straight",
              });
              initEdges.push({
                id: `${id}=>${id}`,
                source: id,
                target: id,
                type: "straight",
              });
              parentId = id;
            }

            initEdges.push({
              id: `${parentId}=>${node.id}`,
              source: parentId,
              target: node.id,
            });
          }
        });
      }
    });
  };

  useEffect(() => {
    if (graph) {
      const root = graph.find(
        (card: vsmObject) => card.type === vsmObjectTypes.root
      );
      if (root) {
        if (selectedObject) {
          const updatedSelectedObject = graph.find(
            (node) => node.id === selectedObject.id
          );
          updatedSelectedObject && setSelectedObject(updatedSelectedObject);
        }
        createNodes(root);
        setNodesDepth(initNodes);
        createFillerNodes();
        const finalNodes = setLayout(initNodes, initEdges);
        setNodes(finalNodes);
        setEdges(initEdges);
      }
    }
  }, [graph]);

  const onNodeDragStart = (
    evt: MouseEvent<Element>,
    nodeDragging: Node<NodeData>
  ) => {
    dragRef.current = nodeDragging;
    setNodes((nodes) =>
      nodes.map((node) => {
        if (validDropTarget(nodeDragging, node)) {
          node.data = { ...node.data, isValidDropTarget: true };
        } else {
          node.data = { ...node.data, isValidDropTarget: false };
        }
        return node;
      })
    );
    setSource(nodeDragging);
  };

  const onNodeDrag = (
    evt: MouseEvent<Element>,
    node: Node<NodeDataFull>
  ): void => {
    const centerX = node.position.x + (node.width || nodeWidth) / 2;
    const centerY = node.position.y + (node.height || nodeHeight) / 2;

    const targetNode = nodes.find(
      (n) =>
        centerX > n.position.x &&
        centerX < n.position.x + 130 &&
        centerY > n.position.y &&
        centerY < n.position.y + 140 &&
        n.id !== node.id
    );

    setTarget(targetNode);
  };

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === target?.id && validDropTarget(node, target)) {
          node.data = { ...node.data, isDropTarget: true };
        } else {
          node.data = { ...node.data, isDropTarget: false };
        }
        return node;
      })
    );
  }, [target]);

  const onNodeDragStop = (
    evt: MouseEvent<Element>,
    node: Node<NodeData>
  ): void => {
    if (target && validDropTarget(node, target)) {
      handleMoveCard.mutate({
        cardId: node.id,
        targetId: target.id,
        position:
          node.type === vsmObjectTypes.mainActivity &&
          target.type === vsmObjectTypes.mainActivity
            ? Position.Right
            : Position.Bottom,
        includeChildren:
          target.data.children.length === 0 ||
          node?.data?.type === vsmObjectTypes.choice,
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

  return (
    <div
      style={{
        width: "100vw",
        height: "calc(100vh - 64px)",
        overflow: "hidden",
      }}
    >
      {showVersionHistoryBottomSheet && (
        <div
          onWheel={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            bottom: "0",
            zIndex: 1,
            width: "100%",
          }}
        >
          <Button
            style={{
              position: "absolute",
              right: "0",
              top: "0",
            }}
            variant={"ghost_icon"}
            onClick={closeVersionHistoryBottomSheet}
          >
            <Icon data={close} />
          </Button>
          <ProcessTimeline processId={projectId} />
        </div>
      )}
      <CanvasButtons
        userCanEdit={userCanEdit}
        handleClickLabel={() => setVisibleLabelScrim(true)}
        handleClickVersionHistory={() => setShowVersionHistoryBottomSheet(true)}
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
                // eslint-disable-next-line sonarjs/no-nested-template-literals
                socketReason ? ` because of ${socketReason}` : ""
              }.`
        }
      />
      <ToBeToggle />
      <ResetProcessButton />
      {selectedObject && (
        <DeleteVsmObjectDialog
          objectToDelete={selectedObject}
          visible={visibleDeleteScrim}
          onClose={() => {
            setVisibleDeleteScrim(false);
            setSelectedObject(undefined);
          }}
        />
      )}
      <VSMSideBar
        onClose={() => setSelectedObject(undefined)}
        onDelete={() => setVisibleDeleteScrim(true)}
        canEdit={userCanEdit}
        selectedObject={selectedObject}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={() => setSelectedObject(undefined)}
        minZoom={0.2}
        nodesDraggable={userCanEdit}
        nodesConnectable={true}
        zoomOnDoubleClick={false}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        attributionPosition="top-left"
        fitView
        fitViewOptions={{ includeHiddenNodes: true }}
        connectionRadius={100}
      >
        <Controls
          showInteractive={false}
          fitViewOptions={{ includeHiddenNodes: true }}
        />
      </ReactFlow>
    </div>
  );
}

export function CanvasWrapper(props: CanvasProps) {
  return (
    <ReactFlowProvider>
      <Canvas {...props} />
    </ReactFlowProvider>
  );
}
