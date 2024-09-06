import { useEffect, useState } from "react";
import { Connection, Position, useStore } from "reactflow";
import { formatDuration } from "@/utils/unitDefinitions";
import { Icon, Typography } from "@equinor/eds-core-react";
import { time as timeIcon } from "@equinor/eds-icons";

import styles from "./Node.module.scss";
import { NodeButtonsContainer } from "./NodeButtonsContainer";
import { SubActivityButton } from "./SubActivityButton";
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
import { SourceHandle } from "./SourceHandle";
import { NodeShape } from "./NodeShape";
import { NodeTooltip } from "./NodeTooltip";
import { NodeTooltipSection } from "./NodeTooltipSection";
import { QIPRContainer } from "./QIPRContainer";
import { useNodeAdd } from "./hooks/useNodeAdd";

export const WaitingNode = ({
  data: {
    description,
    id,
    duration,
    unit,
    type,
    tasks,
    isValidDropTarget,
    isDropTarget,
    mergeable,
    mergeOption,
    handleClickNode,
    handleMerge,
    merging,
    isChoiceChild,
    userCanEdit,
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
                    addNode(id, { type: NodeTypes.subActivity }, Position.Right)
                  }
                  disabled={isNodeButtonDisabled(id, Position.Right)}
                />
                <ChoiceButton
                  onClick={() =>
                    addNode(id, { type: NodeTypes.choice }, Position.Right)
                  }
                  disabled={isNodeButtonDisabled(id, Position.Right)}
                />
                <WaitingButton
                  onClick={() =>
                    addNode(id, { type: NodeTypes.waiting }, Position.Right)
                  }
                  disabled={isNodeButtonDisabled(id, Position.Right)}
                />
              </NodeButtonsContainer>
              <NodeButtonsContainer position={Position.Left}>
                <SubActivityButton
                  onClick={() =>
                    addNode(id, { type: NodeTypes.subActivity }, Position.Left)
                  }
                  disabled={isNodeButtonDisabled(id, Position.Left)}
                />
                <ChoiceButton
                  onClick={() =>
                    addNode(id, { type: NodeTypes.choice }, Position.Left)
                  }
                  disabled={isNodeButtonDisabled(id, Position.Left)}
                />
                <WaitingButton
                  onClick={() =>
                    addNode(id, { type: NodeTypes.waiting }, Position.Left)
                  }
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
          color={colors.NODE_WAITING}
          width={shapeWidth}
          height={shapeHeight}
          onMouseEnter={() => !dragging && setHoveringShape(true)}
          onMouseLeave={() => setHoveringShape(false)}
        >
          <NodeDescription
            header={!description ? type : undefined}
            description={description}
          />
          <div className={styles["node__waitingtime-container"]}>
            <Icon data={timeIcon} size={24} style={{ marginRight: 5 }} />
            <Typography variant="caption">
              {formatDuration(duration, unit)}
            </Typography>
          </div>
        </NodeShape>
        <QIPRContainer tasks={tasks} />
      </NodeCard>
      <TargetHandle hidden={!mergeOption} />
      <SourceHandle />
      <NodeTooltip
        isVisible={
          !!(hoveringShape && (description || typeof duration === "number"))
        }
      >
        {description && (
          <NodeTooltipSection header={"Description"} text={description} />
        )}
        {duration && (
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
