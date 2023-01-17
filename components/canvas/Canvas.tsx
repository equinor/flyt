import "reactflow/dist/style.css";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { moveVSMObject, postVSMObject } from "../../services/vsmObjectApi";
import { useAccount, useMsal } from "@azure/msal-react";
import { useMutation, useQueryClient } from "react-query";

import { DeleteVsmObjectDialog } from "../DeleteVsmObjectDialog";
import { LiveIndicator } from "../LiveIndicator";
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
} from "reactflow";
import useLayout from "./hooks/useLayout";
import nodeTypes from "./NodeTypes";
import { vsmObjectTypes } from "types/vsmObjectTypes";

function Canvas(props): JSX.Element {
  const [selectedObject, setSelectedObject] = useState(null);
  const dispatch = useStoreDispatch();
  const router = useRouter();
  const { id, version } = router.query;
  const { project } = props;

  const [socketConnected, setSocketConnected] = useState(false);
  const [socketReason, setSocketReason] = useState("");

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const rootNode = {
    id: project.objects[0].vsmObjectID.toString(),
    data: {},
    position: { x: 0, y: 0 },
    type: "rootCard",
  };

  const [nodes, setNodes, onNodesChange] = useNodesState([rootNode]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [visibleDeleteScrim, setVisibleDeleteScrim] = useState(false);
  const [visibleLabelScrim, setVisibleLabelScrim] = useState(false);
  const myAccess = getMyAccess(project, account);
  const userCanEdit = !version && myAccess !== "Reader";

  const queryClient = useQueryClient();
  const vsmObjectMutation = useMutation(
    (newObject: vsmObject) => {
      dispatch.setSnackMessage("⏳ Moving card...");
      return moveVSMObject(newObject);
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
  const vsmObjectAddMutation = useMutation(
    (newObject: vsmObject) => {
      dispatch.setSnackMessage("⏳ Adding new card...");
      return postVSMObject(newObject);
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
  const projectId = router.query.id as string;
  const [showVersionHistoryBottomSheet, setShowVersionHistoryBottomSheet] =
    React.useState(!!router.query.version);

  function goToCurrentVersion() {
    // navigate back to current version
    router.replace(`/process/${projectId}`);
  }

  function closeVersionHistoryBottomSheet() {
    setShowVersionHistoryBottomSheet(false);
    goToCurrentVersion();
  }

  const getCardById = (id) =>
    project.objects.find((vsmObj) => vsmObj.vsmObjectID === id);

  let nodesToMerge = [];
  let mergeGroupId = null;

  const handleMergeClick = (mergeGroupId, nodeId) => {
    nodesToMerge.push(nodeId);
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id == nodeId) {
          node.data = { ...node.data, mergeInitiator: true };
        } else if (node.data.mergeGroupId == mergeGroupId) {
          node.data = { ...node.data, mergeOption: true };
        } else {
          node.data = {
            ...node.data,
            mergeInitiator: false,
            mergeOption: false,
          };
        }
        return node;
      })
    );
  };

  const handleCancelMerge = (mergeGroupId, nodeId) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id == nodeId) {
          node.data = { ...node.data, mergeInitiator: false };
        } else if (node.data.mergeGroupId == mergeGroupId) {
          node.data = { ...node.data, mergeOption: false };
        }
        return node;
      })
    );
    nodesToMerge = [];
  };

  const handleMergeOption = (vsmObjectID) =>
    nodesToMerge.includes(vsmObjectID)
      ? nodesToMerge.splice(nodesToMerge.indexOf(vsmObjectID), 1)
      : nodesToMerge.push(vsmObjectID);

  const handleConfirmMerge = (vsmObjectType) => {
    console.log(vsmObjectType);
    console.log(nodesToMerge);
    console.log("MERGE");
  };

  const addCardChildren = (card, cbNode, cbEdge, parentCard = null) => {
    if (parentCard) {
      if (
        card.vsmObjectType.pkObjectType === vsmObjectTypes.mainActivity ||
        card.vsmObjectType.pkObjectType === vsmObjectTypes.output
      ) {
        mergeGroupId = card.vsmObjectID;
      }
      cbNode({
        id: card.vsmObjectID.toString(),
        data: {
          card,
          handleClick: (card) => setSelectedObject(card),
          onClickMergeButton: (mergeGroupId, vsmObjectID) =>
            handleMergeClick(mergeGroupId, vsmObjectID),
          onClickMergeOption: () => handleMergeOption(card.vsmObjectID),
          confirmMerge: (vsmObjectType) => handleConfirmMerge(vsmObjectType),
          cancelMerge: (mergeGroupId, vsmObjectID) =>
            handleCancelMerge(mergeGroupId, vsmObjectID),
          mergeGroupId: card.childObjects.length == 0 ? mergeGroupId : null,
        },
        position: { x: 0, y: 0 },
        type: card.vsmObjectType.pkObjectType,
        extent: "parent",
      });

      cbEdge({
        id: `${parentCard.vsmObjectID}=>${card.vsmObjectID}`,
        source: parentCard.vsmObjectID.toString(),
        target: card.vsmObjectID.toString(),
      });
    }

    card.childObjects.forEach((childCardId) => {
      const childCard = getCardById(childCardId);
      addCardChildren(childCard, cbNode, cbEdge, card);
    });
  };

  useEffect(() => {
    const initNodes = [];
    const initEdges = [];
    addCardChildren(
      project.objects[0],
      (node) => {
        initNodes.push(node);
      },
      (edge) => {
        initEdges.push(edge);
      }
    );
    setNodes([rootNode, ...initNodes]);
    setEdges(initEdges);
  }, [project]);

  const dragRef = useRef(null);
  const [target, setTarget] = useState(null);
  const [source, setSource] = useState(null);

  const isValidDrop = (source, target) => {
    const sourceType = source.type;
    const targetType = target.type;
    // const sourceType = source.data.card.vsmObjectType.pkObjectType;
    // const targetType = target.data.card.vsmObjectType.pkObjectType;
    if (
      ((sourceType === 10 || sourceType === 5 || sourceType === 7) &&
        (targetType === 10 ||
          targetType === 5 ||
          targetType === 7 ||
          targetType === 4)) ||
      (sourceType === 4 && targetType === 4)
    ) {
      return true;
    }
    return false;
  };

  const onNodeDragStart = (evt, nodeDragging) => {
    // TODO: Drag children aswell
    dragRef.current = nodeDragging;
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id == nodeDragging.id) {
          node.data = { ...node.data, isDragging: true };
        } else if (isValidDrop(nodeDragging, node)) {
          node.data = { ...node.data, isValidDropTarget: true };
        } else {
          node.data = { ...node.data, isValidDropTarget: false };
        }
        return node;
      })
    );
    setSource(nodeDragging);
  };

  const onNodeDrag = (evt, node) => {
    // Check edges instead?
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
        if (node.id === target?.id && isValidDrop(node, target)) {
          node.data = { ...node.data, isDropTarget: true };
        } else {
          node.data = { ...node.data, isDropTarget: false };
        }
        return node;
      })
    );
  }, [target]);

  const onNodeDragStop = (evt, node) => {
    if (!target || !isValidDrop(node, target)) {
      setNodes((nodes) =>
        nodes.map((n) => {
          if (n.id === node?.id) {
            n = source;
          }
          return n;
        })
      );
    } else {
      setTarget(null);
      dragRef.current = null;
    }
    setNodes((nodes) =>
      nodes.map((node) => {
        node.data = { ...node.data, isValidDropTarget: undefined };
        return node;
      })
    );
  };

  useLayout();

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
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
            : `You are not connected ${
                socketReason ? `because of ${socketReason}` : ""
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
        fitView
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={() => setSelectedObject(null)}
        minZoom={0.2}
        nodesDraggable={true}
        nodesConnectable={false}
        zoomOnDoubleClick={false}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        attributionPosition="top-left"
      />
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
