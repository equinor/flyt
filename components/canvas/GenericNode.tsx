import { NodeData } from "types/NodeData";
import { useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import stylesNodeButtons from "./NodeButtons.module.scss";
import { NodeButtonsContainer } from "./NodeButtonsContainer";
import { MainActivityButton } from "./MainActivityButton";
import { NodeTypes } from "types/NodeTypes";
import { NodeDescription } from "./NodeDescription";
import { NodeCard } from "./NodeCard";
import colors from "theme/colors";

export const GenericNode = ({
  data: {
    id,
    description,
    type,
    tasks,
    isValidDropTarget,
    isDropTarget,
    handleClickNode,
    handleClickAddNode,
    userCanEdit,
    merging,
    shapeHeight,
    shapeWidth,
  },
  dragging,
}: NodeProps<NodeData>) => {
  const [hovering, setHovering] = useState(false);

  const renderNodeButtons = () => {
    const nodeButtonsPosition =
      type === NodeTypes.input
        ? Position.Right
        : type === NodeTypes.output
        ? Position.Left
        : undefined;
    if (userCanEdit && hovering && !merging && nodeButtonsPosition) {
      return (
        <NodeButtonsContainer position={nodeButtonsPosition}>
          <MainActivityButton
            onClick={() =>
              handleClickAddNode(
                id,
                NodeTypes.mainActivity,
                nodeButtonsPosition
              )
            }
          />
        </NodeButtonsContainer>
      );
    }
  };

  return (
    <div
      onMouseEnter={() => !dragging && setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <NodeCard
        shape="square"
        height={shapeHeight}
        width={shapeWidth}
        color={colors.NODE_GENERIC}
        tasks={tasks}
        onClick={handleClickNode}
        hovering={hovering && !merging}
        highlighted={isDropTarget && isValidDropTarget}
        darkened={isValidDropTarget === false}
      >
        <NodeDescription header={type} description={description} />
      </NodeCard>
      <Handle
        className={stylesNodeButtons["handle--hidden"]}
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
      {renderNodeButtons()}
    </div>
  );
};
