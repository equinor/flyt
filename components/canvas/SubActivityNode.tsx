import React, { useEffect, useState } from "react";
import { Connection, Position, useStore } from "reactflow";
import { FormatNodeText } from "./utils/FormatNodeText";
import { formatDuration } from "@/utils/unitDefinitions";
import styles from "./Node.module.scss";
import { SubActivityButton } from "./SubActivityButton";
import { NodeButtonsContainer } from "./NodeButtonsContainer";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";
import { NodeData } from "types/NodeData";
import { NodeProps } from "reactflow";
import { NodeTypes } from "types/NodeTypes";
import { MergeButton } from "./MergeButton";
import { TargetHandle } from "./TargetHandle";
import { NodeDescription } from "./NodeDescription";
import { NodeCard } from "./NodeCard";
import colors from "theme/colors";
import { NodeDuration } from "./NodeDuration";
import { SourceHandle } from "./SourceHandle";
import { NodeTooltip } from "./NodeTooltip";
import { QIPRContainer } from "./QIPRContainer";
import { NodeTooltipSection } from "./NodeTooltipSection";
import { NodeShape } from "./NodeShape";
import { useNodeAdd } from "./hooks/useNodeAdd";

export const SubActivityNode = ({
  data: {
    description,
    role,
    duration,
    unit,
    type,
    tasks,
    id,
    isValidDropTarget,
    isDropTarget,
    merging,
    mergeOption,
    handleClickNode,
    handleMerge,
    isChoiceChild,
    userCanEdit,
    mergeable,
    shapeHeight,
    shapeWidth,
  },
  dragging,
}: NodeProps<NodeData>) => {
  const [hovering, setHovering] = useState(false);
  const [hoveringShape, setHoveringShape] = useState(false);
  const connectionNodeId = useStore((state) => state.connectionNodeId);
  const { addNode, isNodeButtonDisabled } = useNodeAdd();

  useEffect(() => {
    setHovering(false);
    setHoveringShape(false);
  }, [dragging, connectionNodeId]);

  const renderNodeButtons = () => {
    if (userCanEdit && hovering && !merging) {
      return (
        <>
          <NodeButtonsContainer position={Position.Bottom}>
            <SubActivityButton
              onClick={() =>
                addNode(id, NodeTypes.subActivity, Position.Bottom)
              }
              disabled={isNodeButtonDisabled(id, Position.Bottom)}
            />
            <ChoiceButton
              onClick={() => addNode(id, NodeTypes.choice, Position.Bottom)}
              disabled={isNodeButtonDisabled(id, Position.Bottom)}
            />
            <WaitingButton
              onClick={() => addNode(id, NodeTypes.waiting, Position.Bottom)}
              disabled={isNodeButtonDisabled(id, Position.Bottom)}
            />
            {mergeable && handleMerge && (
              <MergeButton
                onConnect={(e: Connection) => handleMerge(e.source, e.target)}
              />
            )}
          </NodeButtonsContainer>
          {isChoiceChild && (
            <>
              <NodeButtonsContainer position={Position.Right}>
                <SubActivityButton
                  onClick={() =>
                    addNode(id, NodeTypes.subActivity, Position.Right)
                  }
                  disabled={isNodeButtonDisabled(id, Position.Right)}
                />
                <ChoiceButton
                  onClick={() => addNode(id, NodeTypes.choice, Position.Right)}
                  disabled={isNodeButtonDisabled(id, Position.Right)}
                />
                <WaitingButton
                  onClick={() => addNode(id, NodeTypes.waiting, Position.Right)}
                  disabled={isNodeButtonDisabled(id, Position.Right)}
                />
              </NodeButtonsContainer>
              <NodeButtonsContainer position={Position.Left}>
                <SubActivityButton
                  onClick={() =>
                    addNode(id, NodeTypes.subActivity, Position.Left)
                  }
                  disabled={isNodeButtonDisabled(id, Position.Left)}
                />
                <ChoiceButton
                  onClick={() => addNode(id, NodeTypes.choice, Position.Left)}
                  disabled={isNodeButtonDisabled(id, Position.Left)}
                />
                <WaitingButton
                  onClick={() => addNode(id, NodeTypes.waiting, Position.Left)}
                  disabled={isNodeButtonDisabled(id, Position.Left)}
                />
              </NodeButtonsContainer>
            </>
          )}
        </>
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
          color={colors.NODE_SUBACTIVITY}
          width={shapeWidth}
          height={shapeHeight}
          onMouseEnter={() => !dragging && setHoveringShape(true)}
          onMouseLeave={() => setHoveringShape(false)}
        >
          <NodeDescription
            header={!description ? type : undefined}
            description={description}
          />
          <div className={styles["node__role-container"]}>
            <FormatNodeText
              variant="caption"
              className={styles["node__info-text"]}
            >
              {role}
            </FormatNodeText>
          </div>
          <NodeDuration duration={formatDuration(duration, unit)} />
        </NodeShape>
        <QIPRContainer tasks={tasks} />
      </NodeCard>
      <TargetHandle hidden={!mergeOption} />
      <SourceHandle />
      <NodeTooltip
        isVisible={!!(hoveringShape && (description || role || duration))}
      >
        {description && (
          <NodeTooltipSection header={"Description"} text={description} />
        )}
        {role && <NodeTooltipSection header={"Role(s)"} text={role} />}
        {duration !== null && unit !== null && (
          <NodeTooltipSection
            header={"Duration"}
            text={formatDuration(duration, unit)}
          />
        )}
      </NodeTooltip>
      {renderNodeButtons()}
    </div>
  );
};
