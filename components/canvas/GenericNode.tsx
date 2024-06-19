import { NodeData } from "types/NodeData";
import { useState, useEffect } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import stylesNodeButtons from "./NodeButtons.module.scss";
import { NodeButtonsContainer } from "./NodeButtonsContainer";
import { MainActivityButton } from "./MainActivityButton";
import { NodeTypes } from "types/NodeTypes";
import { NodeDescription } from "./NodeDescription";
import { NodeCard } from "./NodeCard";
import colors from "theme/colors";
import { QIPRContainer } from "./QIPRContainer";
import { NodeShape } from "./NodeShape";
import { NodeTooltip } from "./NodeTooltip";
import { NodeTooltipSection } from "./NodeTooltipSection";

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
  const [hoveringShape, setHoveringShape] = useState(false);

  useEffect(() => {
    setHovering(false);
    setHoveringShape(false);
  }, [dragging]);

  const renderNodeButtons = () => {
    const nodeButtonsPosition =
      type === NodeTypes.input
        ? Position.Right
        : type === NodeTypes.output
        ? Position.Left
        : undefined;
    if (
      userCanEdit &&
      hovering &&
      !merging &&
      nodeButtonsPosition &&
      handleClickAddNode
    ) {
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
        onClick={handleClickNode}
        hovering={hovering && !merging}
        highlighted={isDropTarget && isValidDropTarget}
        darkened={isValidDropTarget === false}
      >
        <NodeShape
          shape={"square"}
          color={colors.NODE_GENERIC}
          width={shapeWidth}
          height={shapeHeight}
          onMouseEnter={() => !dragging && setHoveringShape(true)}
          onMouseLeave={() => setHoveringShape(false)}
        >
          <NodeDescription header={type} description={description} />
        </NodeShape>
        <QIPRContainer tasks={tasks} />
      </NodeCard>
      <Handle
        className={stylesNodeButtons["handle--hidden"]}
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
      <NodeTooltip isVisible={!!(hoveringShape && description)}>
        {description && (
          <NodeTooltipSection header={"Description"} text={description} />
        )}
      </NodeTooltip>
      {renderNodeButtons()}
    </div>
  );
};
