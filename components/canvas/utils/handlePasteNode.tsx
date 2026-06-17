import { NodeDataCommon, NodeDataFull } from "@/types/NodeData";
import { NodeTypes } from "@/types/NodeTypes";
import { Position, Node } from "reactflow";
import { isValidTarget } from "./isValidTarget";
import { NodeDataApiRequestBody } from "@/types/NodeDataApi";
import { getNodeTypeName } from "@/utils/getNodeTypeName";
import { TaskTypes } from "@/types/TaskTypes";
import { Task } from "@/types/Task";

export const handlePasteNode = (
  source: Node<NodeDataCommon>,
  target: Node<NodeDataCommon> | undefined,
  nodes: Node<NodeDataFull, string | undefined>[],
  addNode: (
    parentId: string,
    data: NodeDataApiRequestBody,
    position: Position
  ) => void
) => {
  if (!target?.id) {
    throw new Error(
      "Unable to paste: Hover a card before attempting to paste ⛔"
    );
  }
  const nonResolvedTasks: Task[] | undefined = source?.data?.tasks.filter(
    (task) =>
      !(
        (task.type === TaskTypes.Problem || task.type === TaskTypes.Risk) &&
        task.solved === true
      )
  );
  const sourceNodeData = { ...source.data, tasks: nonResolvedTasks };
  if (!isValidTarget(source, target, nodes, false)) {
    const sourceType = getNodeTypeName(source.data.type);
    const targetType = getNodeTypeName(target.data.type);
    throw new Error(
      `Unable to paste: ${sourceType} card is not allowed below ${targetType} card ⛔`
    );
  }
  addNode(
    target.id,
    sourceNodeData,
    source.type === NodeTypes.mainActivity ? Position.Right : Position.Bottom
  );
};
