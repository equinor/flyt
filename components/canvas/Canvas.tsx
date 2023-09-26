/* eslint-disable @typescript-eslint/ban-ts-comment */
import "reactflow/dist/style.css";
import React, { useEffect, useRef, useState } from "react";
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
import ManageLabelBox from "components/Labels/ManageLabelBox";
import { unknownErrorToString } from "utils/isError";
import { useRouter } from "next/router";
import { useStoreDispatch } from "../../hooks/storeHooks";
import { vsmObject } from "interfaces/VsmObject";
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
} from "reactflow";
import { setLayout } from "./hooks/useLayout";
import { nodeTypes } from "./NodeTypes";
import { NodeData } from "interfaces/NodeData";
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

function Canvas(props): JSX.Element {
  const [selectedObject, setSelectedObject] = useState<vsmObject>(null);
  const dispatch = useStoreDispatch();
  const router = useRouter();
  const { id, version } = router.query;
  const { project, graph } = props;

  const [socketConnected, setSocketConnected] = useState(false);
  const [socketReason, setSocketReason] = useState("");

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  let initNodes: Node<NodeData>[] = [];
  let initEdges: Edge[] = [];
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const nodeWidth = 200;
  const nodeHeight = 200;

  const [visibleDeleteScrim, setVisibleDeleteScrim] = useState(false);
  const [visibleLabelScrim, setVisibleLabelScrim] = useState(false);
  const myAccess = getMyAccess(project, account);
  const userCanEdit = !version && myAccess !== "Reader";

  const queryClient = useQueryClient();
  const projectId = router.query.id as string;
  const [showVersionHistoryBottomSheet, setShowVersionHistoryBottomSheet] =
    React.useState(!!router.query.version);

  const connectionNodeIdSelector = (state) => state.connectionNodeId;
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
      handleMergeCancel(connectionNodeId);
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

  const getCardById = (id: string): vsmObject =>
    graph.find((card: vsmObject) => card.id === id);

  const handleMergeInit = (nodeId: string): void => {
    const initNode = nodes.find((node) => node.id === nodeId);
    const columnId = initNode?.data?.columnId;
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id == nodeId) {
          node.data = { ...node.data };
        } else if (
          node.data.columnId == columnId &&
          !initNode.data.children.find((nodeId) => nodeId === node.id)
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

  const handleMergeCancel = (nodeId: string): void => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id == nodeId) {
          node.data = { ...node.data };
        } else {
          node.data = { ...node.data, mergeOption: false };
        }
        node.data.merging = false;
        return node;
      })
    );
  };

  const handleMerge = useMutation(
    // @ts-ignore
    ({ sourceId, targetId }: { sourceId: string; targetId: string }) => {
      dispatch.setSnackMessage("⏳ Merging cards...");
      mergeVertices(
        { fromVertexId: sourceId, toVertexId: targetId },
        projectId
      );
    },
    {
      onSuccess: () => {
        dispatch.setSnackMessage("✅ Cards merged!");
        notifyOthers("Added a new card", id, account);
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
        case Position.Bottom:
          return addVertice({ type }, projectId, parentId);
        case Position.Left:
          return addVerticeLeft({ type }, projectId, parentId);
        case Position.Right:
          return addVerticeRight({ type }, projectId, parentId);
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
        notifyOthers("Moved a card", id, account);
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  let columnId: string = null;

  const createNodes = (card: vsmObject, parentCard: vsmObject = null): void => {
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
        interactionWidth: 0,
      });

      // Occurs when a node has multiple parents
      const duplicateNode = initNodes.find((node) => node.id === card.id);

      if (duplicateNode) {
        initNodes = initNodes.map((node) => {
          const newData = node.data;
          if (node.id === card.id) {
            newData.isChoiceChild = false; // Keep until backend accepts new choice child when card has multiple parents
            newData.parentCardIDs.push(parentCard.id);
            return { ...node, data: newData };
          }
          // if (parentCard.type === vsmObjectTypes.choice) {
          //   newData.isChoiceChild = true;
          // }
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
            handleMerge.mutate({ sourceId, targetId }),
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
    }

    card.children.forEach((childCardId) => {
      const childCard = getCardById(childCardId);
      createNodes(childCard, card);
    });
  };

  const mergedNodesLooping = new Map();
  let mergedNodesReady = [];

  const setNodeDepth = (nodeId, fullNodes, parentDepth) => {
    const node = fullNodes.find((node) => node.id === nodeId);
    const { data } = node;

    if (data?.parentCardIDs?.length > 1) {
      if (mergedNodesLooping.has(nodeId)) {
        const nodeDuplicate = mergedNodesLooping.get(nodeId)[0];
        const loopCount = mergedNodesLooping.get(nodeId)[1];
        if (nodeDuplicate.data.depth <= parentDepth) {
          nodeDuplicate.data.depth = parentDepth + 1;
        }
        mergedNodesLooping.set(nodeId, [nodeDuplicate, loopCount + 1]);
        if (nodeDuplicate.data.parentCardIDs.length === loopCount + 1) {
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
        setNodeDepth(child, fullNodes, data.depth);
      });
    }
  };

  const setAllNodesDepth = (root) => {
    root.children.forEach((childId) => {
      setNodeDepth(childId, initNodes, 0);
    });
    while (mergedNodesReady.length > 0) {
      const dupeMergedNodesReady = mergedNodesReady;
      mergedNodesReady = [];
      dupeMergedNodesReady.forEach((node) => {
        node.data.children.forEach((child) => {
          setNodeDepth(child, initNodes, node.data.depth);
        });
      });
    }
  };

  const createFillerNodes = () => {
    initNodes.forEach((node) => {
      if (node?.data?.parentCardIDs?.length > 1) {
        let deepestCard = initNodes.find(
          (card) => card.id === node.data.parentCardIDs[0]
        ).data.depth;
        node?.data?.parentCardIDs?.forEach((parentCardID) => {
          const parentCard = initNodes.find((node) => node.id === parentCardID);
          if (parentCard?.data.depth > deepestCard)
            deepestCard = parentCard.data.depth;
        });
        node?.data?.parentCardIDs?.forEach((parentCardID) => {
          const parentCard = initNodes.find((node) => node.id === parentCardID);
          if (parentCard.data.depth < deepestCard) {
            initEdges = initEdges.filter(
              (edge) => edge.source !== parentCard.id || edge.target !== node.id
            );
            let parentId = parentCard.id;
            for (let i = parentCard.data.depth; i < deepestCard; i++) {
              const id = Math.random().toString(11).slice(2);
              initNodes.push({
                id,
                data: {
                  columnId: parentCard.data.columnId,
                },
                position: { x: 0, y: 0 },
                type: vsmObjectTypes.empty,
                width: nodeWidth,
                height: nodeHeight,
                draggable: false,
              });
              initEdges.push({
                id: `${parentId}=>${id}`,
                source: parentId,
                target: id,
                type: "straight",
                interactionWidth: 0,
              });
              parentId = id;
            }

            initEdges.push({
              id: `${parentId}=>${node.id}`,
              source: parentId,
              target: node.id,
              interactionWidth: 0,
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
      if (selectedObject) {
        const updatedSelectedObject = graph.find(
          (node) => node.id === selectedObject.id
        );
        setSelectedObject(updatedSelectedObject);
      }
      createNodes(root);
      setAllNodesDepth(root);
      createFillerNodes();
      const finalNodes = setLayout(initNodes, initEdges);
      setNodes(finalNodes);
      setEdges(initEdges);
    }
  }, [graph]);

  const dragRef = useRef<Node<NodeData>>(null);
  const [target, setTarget] = useState<Node<NodeData>>(null);
  const [source, setSource] = useState<Node<NodeData>>(null);

  const validDropTarget = (
    source: Node<NodeData>,
    target: Node<NodeData>
  ): boolean => {
    if (!target) return false;
    const sourceType = source.type;
    const targetType = target.type;
    const targetIsParent = source?.data?.parentCardIDs?.find(
      (id) => id === target.id
    );

    return (
      !targetIsParent &&
      (((sourceType === vsmObjectTypes.choice ||
        sourceType === vsmObjectTypes.subActivity ||
        sourceType === vsmObjectTypes.waiting) &&
        (targetType === vsmObjectTypes.choice ||
          targetType === vsmObjectTypes.subActivity ||
          targetType === vsmObjectTypes.waiting ||
          targetType === vsmObjectTypes.mainActivity)) ||
        (sourceType === vsmObjectTypes.mainActivity &&
          targetType === vsmObjectTypes.mainActivity))
    );
  };

  const onNodeDragStart = (
    evt: React.MouseEvent<Element, MouseEvent>,
    nodeDragging: Node<NodeData>
  ): void => {
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
    evt: React.MouseEvent<Element, MouseEvent>,
    node: Node<NodeData>
  ): void => {
    const centerX = node.position.x + node.width / 2;
    const centerY = node.position.y + node.height / 2;

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
    evt: React.MouseEvent<Element, MouseEvent>,
    node: Node<NodeData>
  ): void => {
    if (validDropTarget(node, target)) {
      handleMoveCard.mutate({
        cardId: node.id,
        targetId: target.id,
        position:
          node.type === vsmObjectTypes.mainActivity &&
          target.type === vsmObjectTypes.mainActivity
            ? Position.Right
            : Position.Bottom,
        includeChildren: target.data.children.length === 0,
      });
      setTarget(null);
      dragRef.current = null;
    }
    setNodes((nodes) =>
      nodes.map((n) => {
        n.data = { ...n.data, isValidDropTarget: null };
        if (n.id === node?.id) {
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
      <DeleteVsmObjectDialog
        objectToDelete={selectedObject}
        visible={visibleDeleteScrim}
        onClose={() => {
          setVisibleDeleteScrim(false);
          setSelectedObject(null);
        }}
      />
      <VSMSideBar
        onClose={() => setSelectedObject(null)}
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
        onPaneClick={() => setSelectedObject(null)}
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

export function CanvasWrapper(props) {
  return (
    <ReactFlowProvider>
      <Canvas {...props} />
    </ReactFlowProvider>
  );
}
