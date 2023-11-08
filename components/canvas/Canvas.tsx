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
import { CanvasTutorial } from "./CanvasTutorial/CanvasTutorial";

type CanvasProps = {
  graph: Graph;
  project: vsmProject;
};

const Canvas = ({ graph, project }: CanvasProps) => {
  const [selectedNode, setSelectedNode] = useState<vsmObject | undefined>(
    undefined
  );
  const dispatch = useStoreDispatch();
  const router = useRouter();
  const { id, version } = router.query;

  const [socketConnected, setSocketConnected] = useState(false);
  const [socketReason, setSocketReason] = useState("");

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  let tempNodes: Node<NodeDataFull>[] = [];
  let tempEdges: Edge[] = [];
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeDataFull>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const nodeWidth = 200;
  const nodeHeight = 200;

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
      type: vsmObjectTypes;
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
        if (
          sourceNode &&
          sourceNode.id !== node.id &&
          node.data.columnId == sourceNode?.data?.columnId &&
          !sourceNode.data.children.find((childId) => childId === node.id) &&
          !sourceNode.data.parents.find((parentId) => parentId === node.id)
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

  const handleMergeCancel = () => {
    setNodes((nodes) =>
      nodes.map((node) => {
        node.data = { ...node.data, mergeOption: false, merging: false };
        return node;
      })
    );
  };

  let columnId: string | null = null;

  const createNodes = (node: vsmObject, parent: vsmObject | null = null) => {
    if (parent) {
      if (
        node.type === vsmObjectTypes.mainActivity ||
        node.type === vsmObjectTypes.output ||
        node.type === vsmObjectTypes.supplier ||
        node.type === vsmObjectTypes.input ||
        node.type === vsmObjectTypes.customer
      ) {
        columnId = node.id;
      }

      tempEdges.push({
        id: `${parent.id}=>${node.id}`,
        source: parent.id,
        target: node.id,
      });

      // Occurs when a node has multiple parents
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
          handleClickCard: () => setSelectedNode(node),
          handleClickAddCard: (id, type, position) =>
            handleClickAddNode.mutate({ parentId: id, type, position }),
          handleMerge: (sourceId, targetId) =>
            sourceId && targetId && handleMerge.mutate({ sourceId, targetId }),
          mergeable:
            node.children.length === 0 || node.type === vsmObjectTypes.choice,
          merging: !!connectionNodeId,
          parents: [parent.id],
          userCanEdit,
          isChoiceChild: parent.type === vsmObjectTypes.choice,
          columnId,
        },
        position: { x: 0, y: 0 },
        type: node.type,
        width:
          nodeWidth +
          getQIPRContainerWidth(
            node?.tasks?.filter((task) => !task.solved).length
          ),
        height: nodeHeight,
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
        width: nodeWidth,
        height: nodeHeight,
      });
    }

    node.children.forEach((childId) => {
      const childNode = graph.find((node: vsmObject) => node.id === childId);
      childNode && createNodes(childNode, node);
    });
  };

  const createFillerNodes = () => {
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
              tempEdges.push({
                id: `${tempParentNodeId}=>${id}`,
                source: tempParentNodeId,
                target: id,
                type: "straight",
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

  useEffect(() => {
    if (graph) {
      const root = graph.find(
        (node: vsmObject) => node.type === vsmObjectTypes.root
      );
      if (root) {
        if (selectedNode) {
          const updatedSelectedNode = graph.find(
            (node) => node.id === selectedNode.id
          );
          updatedSelectedNode && setSelectedNode(updatedSelectedNode);
        }
        createNodes(root);
        setNodesDepth(tempNodes);
        createFillerNodes();
        const finalNodes = setLayout(tempNodes, tempEdges);
        setNodes(finalNodes);
        setEdges(tempEdges);
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

  const onNodeDrag = (evt: MouseEvent<Element>, node: Node<NodeDataFull>) => {
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

  const onNodeDragStop = (evt: MouseEvent<Element>, node: Node<NodeData>) => {
    if (target && validDropTarget(node, target)) {
      handleMoveNode.mutate({
        nodeId: node.id,
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
                // eslint-disable-next-line sonarjs/no-nested-template-literals
                socketReason ? ` because of ${socketReason}` : ""
              }.`
        }
      />
      <ToBeToggle />
      <ResetProcessButton />
      {selectedNode && (
        <DeleteVsmObjectDialog
          objectToDelete={selectedNode}
          visible={visibleDeleteScrim}
          onClose={() => {
            setVisibleDeleteScrim(false);
            setSelectedNode(undefined);
          }}
        />
      )}
      <VSMSideBar
        onClose={() => setSelectedNode(undefined)}
        onDelete={() => setVisibleDeleteScrim(true)}
        canEdit={userCanEdit}
        selectedObject={selectedNode}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
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
        attributionPosition="top-left"
        fitView
        fitViewOptions={{ includeHiddenNodes: true }}
        connectionRadius={100}
      >
        <Controls
          className={styles.controls}
          showInteractive={false}
          fitViewOptions={{ includeHiddenNodes: true }}
        />
      </ReactFlow>
      <CanvasTutorial />
    </div>
  );
};

export function CanvasWrapper(props: CanvasProps) {
  return (
    <ReactFlowProvider>
      <Canvas {...props} />
    </ReactFlowProvider>
  );
}
