import {
  moveVertice,
  moveVerticeLeftOfTarget,
  moveVerticeRightOfTarget,
} from "@/services/graphApi";
import { notifyOthers } from "@/services/notifyOthers";
import { NodeDataCommon } from "@/types/NodeData";
import { NodeTypes } from "@/types/NodeTypes";
import { unknownErrorToString } from "@/utils/isError";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Node, Position, useReactFlow } from "reactflow";
import { useStoreDispatch } from "@/hooks/storeHooks";
import { targetIsInSubtree } from "../utils/targetIsInSubtree";
import { isValidTarget } from "../utils/isValidTarget";
import { useUserAccount } from "./useUserAccount";
import { useProjectId } from "@/hooks/useProjectId";

export const useNodeDrag = () => {
  const [source, setSource] = useState<Node<NodeDataCommon> | undefined>(
    undefined
  );
  const [target, setTarget] = useState<Node<NodeDataCommon> | undefined>(
    undefined
  );
  const { setNodes, getNodes } = useReactFlow<NodeDataCommon>();
  const dragRef = useRef<Node<NodeDataCommon> | null>(null);
  const dispatch = useStoreDispatch();
  const account = useUserAccount();
  const queryClient = useQueryClient();
  const { projectId } = useProjectId();

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) => {
        node.data = {
          ...node.data,
          isDropTarget: node.id === target?.id,
        };
        return node;
      })
    );
  }, [target]);

  const onNodeDragStart = (
    _evt: MouseEvent,
    nodeDragging: Node<NodeDataCommon>
  ) => {
    dragRef.current = nodeDragging;
    setNodes((nodes) =>
      nodes.map((node) => {
        node.data = {
          ...node.data,
          isValidDropTarget: isValidTarget(nodeDragging, node, getNodes()),
        };
        return node;
      })
    );
    setSource(nodeDragging);
  };

  const onNodeDrag = (_evt: MouseEvent, node: Node<NodeDataCommon>) => {
    if (!node.width || !node.height) return;
    const centerX = node.position.x + node.width / 2;
    const centerY = node.position.y + node.height / 2;

    const targetNode = getNodes().find(
      (n) =>
        centerX > n.position.x &&
        centerX < n.position.x + (node.width ?? 0) &&
        centerY > n.position.y &&
        centerY < n.position.y + (node.height ?? 0) &&
        n.id !== node.id
    );

    setTarget(targetNode);
  };

  const onNodeDragStop = (_evt: MouseEvent, node: Node<NodeDataCommon>) => {
    if (isValidTarget(node, target, getNodes())) {
      moveNode.mutate({
        nodeId: node.id,
        targetId: target?.id ?? "",
        position: target ? getPosition(node, target) : Position.Bottom,
        includeChildren: target ? includeChildren(node, target) : false,
      });
      setTarget(undefined);
      dragRef.current = null;
    }
    setNodes((nodes) =>
      nodes.map((n) => {
        n.data = { ...n.data, isValidDropTarget: undefined };
        if (n.id === node?.id && source) {
          n = source;
        }
        return n;
      })
    );
  };

  const moveNode = useMutation(
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
      if (position === Position.Right) {
        return moveVerticeRightOfTarget(
          { vertexId: nodeId },
          targetId,
          projectId
        );
      }
      if (position === Position.Left) {
        return moveVerticeLeftOfTarget(
          { vertexId: nodeId },
          targetId,
          projectId
        );
      }
      return moveVertice(
        { vertexToMoveId: nodeId, vertexDestinationParentId: targetId },
        projectId,
        includeChildren
      );
    },
    {
      onSuccess: () => {
        dispatch.setSnackMessage("✅ Moved card!");
        projectId && notifyOthers("Moved a card", projectId, account);
        return queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const includeChildren = (
    source: Node<NodeDataCommon>,
    target: Node<NodeDataCommon>
  ) => {
    if (target.data.children.length === 0) {
      if (source?.data?.type === NodeTypes.choice) {
        return true;
      } else if (target.data.column?.id === source.data.column?.id) {
        const nodes = getNodes();
        return !targetIsInSubtree(source, target, nodes);
      }
    }
    return false;
  };

  const getPosition = (
    source: Node<NodeDataCommon>,
    target: Node<NodeDataCommon>
  ) => {
    if (
      source.type === NodeTypes.mainActivity &&
      target?.type === NodeTypes.mainActivity
    ) {
      return (source.data?.order ?? 0) > (target.data?.order ?? 0)
        ? Position.Left
        : Position.Right;
    }
    return Position.Bottom;
  };

  return {
    onNodeDragStart,
    onNodeDrag,
    onNodeDragStop,
  };
};
