import { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { MainActivityButton } from "./MainActivityButton";
import { SubActivityButton } from "./SubActivityButton";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";
import { NodeButtonsContainer } from "./NodeButtonsContainer";
import stylesNodeButtons from "./NodeButtons.module.scss";
import { NodeData } from "types/NodeData";
import { NodeProps } from "reactflow";
import { NodeTypes } from "types/NodeTypes";
import { NodeDescription } from "./NodeDescription";
import { NodeCard } from "./NodeCard";
import colors from "theme/colors";
import { SourceHandle } from "./SourceHandle";
import { NodeShape } from "./NodeShape";
import { QIPRContainer } from "./QIPRContainer";
import { NodeTooltipSection } from "./NodeTooltipSection";
import { NodeTooltip } from "./NodeTooltip";
import { NodeDuration } from "./NodeDuration";
import { formatDurationSum } from "@/types/unitDefinitions";

export const MainActivityNode = ({
  data: {
    description,
    type,
    tasks,
    id,
    isValidDropTarget,
    isDropTarget,
    handleClickNode,
    handleClickAddNode,
    userCanEdit,
    merging,
    shapeHeight,
    shapeWidth,
    sumDuration,
  },
  dragging,
}: NodeProps<NodeData>) => {
  const [hovering, setHovering] = useState(false);
  const [hoveringShape, setHoveringShape] = useState(false);

  const formattedDurationSum = formatDurationSum(sumDuration);

  useEffect(() => {
    setHovering(false);
    setHoveringShape(false);
  }, [dragging]);

  const renderNodeButtons = () => {
    if (hovering && userCanEdit && !merging)
      return (
        <>
          <NodeButtonsContainer position={Position.Left}>
            <MainActivityButton
              onClick={() =>
                handleClickAddNode(id, NodeTypes.mainActivity, Position.Left)
              }
            />
          </NodeButtonsContainer>
          <NodeButtonsContainer position={Position.Right}>
            <MainActivityButton
              onClick={() =>
                handleClickAddNode(id, NodeTypes.mainActivity, Position.Right)
              }
            />
          </NodeButtonsContainer>
          <NodeButtonsContainer position={Position.Bottom}>
            <SubActivityButton
              onClick={() =>
                handleClickAddNode(id, NodeTypes.subActivity, Position.Bottom)
              }
            />
            <ChoiceButton
              onClick={() =>
                handleClickAddNode(id, NodeTypes.choice, Position.Bottom)
              }
            />
            <WaitingButton
              onClick={() =>
                handleClickAddNode(id, NodeTypes.waiting, Position.Bottom)
              }
            />
          </NodeButtonsContainer>
        </>
      );
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
          color={colors.NODE_MAINACTIVITY}
          width={shapeWidth}
          height={shapeHeight}
          onMouseEnter={() => !dragging && setHoveringShape(true)}
          onMouseLeave={() => setHoveringShape(false)}
        >
          <NodeDescription
            header={!description ? type : undefined}
            description={description}
          />
          <NodeDuration duration={formattedDurationSum} />
        </NodeShape>
        <QIPRContainer tasks={tasks} />
      </NodeCard>
      <Handle
        className={stylesNodeButtons["handle--hidden"]}
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
      <SourceHandle />
      <NodeTooltip
        isVisible={
          !!(hoveringShape && (description || formattedDurationSum.length > 0))
        }
      >
        {description && (
          <NodeTooltipSection header={"Description"} text={description} />
        )}
        {formattedDurationSum && (
          <NodeTooltipSection header={"Duration"} text={formattedDurationSum} />
        )}
      </NodeTooltip>
      {renderNodeButtons()}
    </div>
  );
};
