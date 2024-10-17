import { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { MainActivityButton } from "./MainActivityButton";
import { SubActivityButton } from "./SubActivityButton";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";
import { NodeButtonsContainer } from "./NodeButtonsContainer";
import stylesNodeButtons from "./NodeButtons.module.scss";
import { NodeDataCommon } from "types/NodeData";
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
import { useNodeAdd } from "./hooks/useNodeAdd";
import { NodeDuration } from "./NodeDuration";
import {
  formatMinMaxTotalDuration,
  formatMinMaxTotalDurationShort,
} from "@/utils/unitDefinitions";
import { getNodeTypeName } from "@/utils/getNodeTypeName";

export const MainActivityNode = ({
  data: {
    description,
    type,
    tasks,
    id,
    isValidDropTarget,
    isDropTarget,
    handleClickNode,
    userCanEdit,
    merging,
    shapeHeight,
    shapeWidth,
    totalDurations,
    disabled,
  },
  selected,
  dragging,
}: NodeProps<NodeDataCommon>) => {
  const [hovering, setHovering] = useState(false);
  const [hoveringShape, setHoveringShape] = useState(false);
  const { addNode, isNodeButtonDisabled } = useNodeAdd();

  const formattedDurationSum =
    totalDurations && formatMinMaxTotalDuration(totalDurations);
  const formattedDurationSumShort =
    totalDurations && formatMinMaxTotalDurationShort(totalDurations);

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
                addNode(id, { type: NodeTypes.mainActivity }, Position.Left)
              }
              disabled={isNodeButtonDisabled(id, Position.Left)}
            />
          </NodeButtonsContainer>
          <NodeButtonsContainer position={Position.Right}>
            <MainActivityButton
              onClick={() =>
                addNode(id, { type: NodeTypes.mainActivity }, Position.Right)
              }
              disabled={isNodeButtonDisabled(id, Position.Right)}
            />
          </NodeButtonsContainer>
          <NodeButtonsContainer position={Position.Bottom}>
            <SubActivityButton
              onClick={() =>
                addNode(id, { type: NodeTypes.subActivity }, Position.Bottom)
              }
              disabled={isNodeButtonDisabled(id, Position.Bottom)}
            />
            <ChoiceButton
              onClick={() =>
                addNode(id, { type: NodeTypes.choice }, Position.Bottom)
              }
              disabled={isNodeButtonDisabled(id, Position.Bottom)}
            />
            <WaitingButton
              onClick={() =>
                addNode(id, { type: NodeTypes.waiting }, Position.Bottom)
              }
              disabled={isNodeButtonDisabled(id, Position.Bottom)}
            />
          </NodeButtonsContainer>
        </>
      );
  };

  return (
    <div
      onMouseEnter={() => !disabled && !dragging && setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <NodeCard
        onClick={handleClickNode}
        hovering={hovering && !merging}
        highlighted={isDropTarget && isValidDropTarget}
        disabled={disabled || isValidDropTarget === false}
        selected={selected}
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
            header={!description ? getNodeTypeName(type) : undefined}
            description={description}
          />
          {formattedDurationSumShort && (
            <NodeDuration duration={formattedDurationSumShort} />
          )}
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
        isVisible={!!(hoveringShape && (description || formattedDurationSum))}
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
