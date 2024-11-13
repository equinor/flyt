import { EdgeDataApi } from "@/types/EdgeDataApi";
import { NodeDataCommon, NodeDataFull } from "@/types/NodeData";
import { NodeDataApi } from "@/types/NodeDataApi";
import { NodeTypes } from "@/types/NodeTypes";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Edge,
  Node,
  useEdgesState,
  useNodesInitialized,
  useNodesState,
} from "reactflow";
import { createEdges } from "../utils/createEdges";
import { createHiddenNodes } from "../utils/createHiddenNodes";
import { createNodes } from "../utils/createNodes";
import { setMainActivitiesDurationSum } from "../utils/setMainActivitiesDurationSum";
import { setNodesDepth } from "../utils/setNodesDepth";
import { useCenterCanvas } from "./useCenterCanvas";
import { setLayout } from "./useLayout";
import { useNodeMerge } from "./useNodeMerge";

export const useFlowState = (
  apiNodes: NodeDataApi[],
  apiEdges: EdgeDataApi[],
  userCanEdit: boolean,
  disabledNodeTypes?: NodeTypes[]
) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeDataFull>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<
    Node<NodeDataCommon> | undefined
  >(undefined);
  const [hoveredNode, setHoveredNode] = useState<
    Node<NodeDataCommon> | undefined
  >(undefined);
  const [nodeToBeDeleted, setNodeToBeDeleted] = useState<
    Node<NodeDataCommon> | undefined
  >(undefined);
  const [isEditingEdgeText, setIsEditingEdgeText] = useState(false);
  const [edgeToBeDeletedId, setEdgeToBeDeletedId] = useState<
    string | undefined
  >(undefined);

  const nodesInitialized = useNodesInitialized();
  const { mutate: mergeNode, merging } = useNodeMerge();
  useCenterCanvas();

  let tempNodes: Node<NodeDataFull>[] = [];
  const tempEdges: Edge[] = apiEdges.map((e) => ({ ...e, label: e.edgeValue }));
  const shapeSize = { height: 140, width: 140 };
  const isEditingEdge = isEditingEdgeText || !!edgeToBeDeletedId;

  const handleClickNode = (id?: string) => {
    const node = tempNodes.find((n) => n.id === id);
    if (!node) return;
    setSelectedNode(node as Node<NodeDataCommon>);
  };

  const handleSetSelectedEdge = (selectedEdge: Edge | undefined) => {
    if (userCanEdit && !isEditingEdge) {
      const updatedEdges = edges.map((e) => {
        e.selected = e.id === selectedEdge?.id;
        return e;
      });
      setEdges(updatedEdges);
    }
  };

  const updateNodesSelectedProp = () => {
    if (nodesInitialized) {
      const updatedNodes = nodes.map((n) => ({
        ...n,
        selected: n.id === selectedNode?.id,
      }));
      setNodes(updatedNodes);
    }
  };

  useEffect(() => {
    updateNodesSelectedProp();
  }, [selectedNode]);

  useLayoutEffect(() => {
    const root = apiNodes.find(
      (node: NodeDataApi) => node.type === NodeTypes.root
    );

    if (!root) {
      setNodes([]);
      setEdges([]);
      return;
    }

    tempNodes = createNodes(
      apiNodes,
      shapeSize,
      userCanEdit,
      merging,
      mergeNode,
      handleClickNode,
      disabledNodeTypes
    );
    tempNodes = setMainActivitiesDurationSum(
      tempNodes as Node<NodeDataCommon>[]
    );
    tempNodes = setNodesDepth(tempNodes);
    const {
      tempNodes: tempWithHiddenNodes,
      tempEdges: tempWithHiddenEdges,
      longEdges,
    } = createHiddenNodes(tempNodes, tempEdges, shapeSize);
    const finalNodes = setLayout(tempWithHiddenNodes, tempWithHiddenEdges);
    const finalEdges = createEdges(
      finalNodes,
      tempWithHiddenEdges,
      longEdges,
      shapeSize,
      userCanEdit,
      setIsEditingEdgeText,
      setEdgeToBeDeletedId
    );
    setNodes(finalNodes);
    setEdges(finalEdges);

    selectedNode && handleClickNode(selectedNode.id);
  }, [apiNodes, apiEdges, userCanEdit]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    selectedNode,
    setSelectedNode,
    hoveredNode,
    setHoveredNode,
    nodeToBeDeleted,
    setNodeToBeDeleted,
    handleSetSelectedEdge,
    edgeToBeDeletedId,
    setEdgeToBeDeletedId,
  };
};
