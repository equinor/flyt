import { moveVertice, moveVerticeRightOfTarget } from "@/services/graphApi";
import { notifyOthers } from "@/services/notifyOthers";
import { NodeData } from "@/types/NodeData";
import { NodeTypes } from "@/types/NodeTypes";
import { unknownErrorToString } from "@/utils/isError";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Node, Position, useReactFlow } from "reactflow";
import { useStoreDispatch } from "../../../hooks/storeHooks";
import { targetIsInSubtree } from "../utils/targetIsInSubtree";
import { validTarget } from "../utils/validTarget";
import { useUserAccount } from "./useUserAccount";
import { useProjectId } from "../../../hooks/useProjectId";

export const useNodeDrag = () => {
  const [source, setSource] = useState<Node<NodeData> | undefined>(undefined);
  const [target, setTarget] = useState<Node<NodeData> | undefined>(undefined);
  const { setNodes, getNodes } = useReactFlow<NodeData>();
  const dragRef = useRef<Node<NodeData> | null>(null);
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
    evt: MouseEvent<Element>,
    nodeDragging: Node<NodeData>
  ) => {
    dragRef.current = nodeDragging;
    setNodes((nodes) =>
      nodes.map((node) => {
        node.data = {
          ...node.data,
          isValidDropTarget: validTarget(nodeDragging, node, getNodes()),
        };
        return node;
      })
    );
    setSource(nodeDragging);
  };

  const onNodeDrag = (evt: MouseEvent, node: Node<NodeData>) => {
    if (!node.width || !node.height) return;
    const centerX = node.position.x + node.width / 2;
    const centerY = node.position.y + node.height / 2;

    const targetNode = getNodes().find(
      (n) =>
        centerX > n.position.x &&
        centerX < n.position.x + node.width &&
        centerY > n.position.y &&
        centerY < n.position.y + node.height &&
        n.id !== node.id
    );

    setTarget(targetNode);
  };

  const onNodeDragStop = (evt: MouseEvent, node: Node<NodeData>) => {
    if (validTarget(node, target, getNodes())) {
      moveNode.mutate({
        nodeId: node.id,
        targetId: target.id,
        position:
          node.type === NodeTypes.mainActivity &&
          target.type === NodeTypes.mainActivity
            ? Position.Right
            : Position.Bottom,
        includeChildren: includeChildren(node, target),
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
        projectId && notifyOthers("Moved a card", projectId, account);
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const includeChildren = (source: Node<NodeData>, target: Node<NodeData>) => {
    if (target.data.children.length === 0) {
      if (source?.data?.type === NodeTypes.choice) {
        return true;
      } else if (target.data.columnId === source.data.columnId) {
        const nodes = getNodes();
        return !targetIsInSubtree(source, target, nodes);
      }
    }
    return false;
  };

  return {
    onNodeDragStart,
    onNodeDrag,
    onNodeDragStop,
  };
};
