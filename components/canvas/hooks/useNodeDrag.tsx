import { NodeData, NodeDataFull } from "@/types/NodeData";
import { NodeTypes } from "@/types/NodeTypes";
import { useEffect, MouseEvent, useRef, useState } from "react";
import { Node } from "reactflow";
import { Position, useReactFlow } from "reactflow";
import router from "next/router";
import { moveVertice, moveVerticeRightOfTarget } from "@/services/graphApi";
import { validTarget } from "../utils/validTarget";
import { notifyOthers } from "@/services/notifyOthers";
import { unknownErrorToString } from "@/utils/isError";
import { useMutation, useQueryClient } from "react-query";
import { useStoreDispatch } from "../../../hooks/storeHooks";
import { useUserAccount } from "./useUserAccount";

export const useNodeDrag = () => {
  const [source, setSource] = useState<Node<NodeDataFull> | undefined>(
    undefined
  );
  const [target, setTarget] = useState<Node<NodeDataFull> | undefined>(
    undefined
  );
  const { setNodes, getNodes } = useReactFlow();
  const dragRef = useRef<Node<NodeData> | null>(null);
  const dispatch = useStoreDispatch();
  const account = useUserAccount();
  const queryClient = useQueryClient();
  const id = router.query.id as string;

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) => {
        node.data = {
          ...node.data,
          isDropTarget: node.id === target?.id && validTarget(node, target),
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
          isValidDropTarget: validTarget(nodeDragging, node),
        };
        return node;
      })
    );
    setSource(nodeDragging);
  };

  const onNodeDrag = (evt: MouseEvent, node: Node<NodeDataFull>) => {
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
    if (validTarget(node, target)) {
      moveNode.mutate({
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
            id,
            includeChildren
          )
        : moveVerticeRightOfTarget({ vertexId: nodeId }, targetId, id);
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

  return {
    onNodeDragStart,
    onNodeDrag,
    onNodeDragStop,
  };
};
