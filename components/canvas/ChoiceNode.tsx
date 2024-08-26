import { useEffect, useState } from "react";
import { Connection, NodeProps, Position, useStore } from "reactflow";
import { NodeButtonsContainer } from "./NodeButtonsContainer";
import { SubActivityButton } from "./SubActivityButton";
import { ChoiceButton } from "./ChoiceButton";
import { WaitingButton } from "./WaitingButton";
import { NodeTypes } from "types/NodeTypes";
import { TargetHandle } from "./TargetHandle";
import { MergeButton } from "./MergeButton";
import { NodeData } from "types/NodeData";
import colors from "theme/colors";
import { NodeCard } from "./NodeCard";
import { NodeDescription } from "./NodeDescription";
import { SourceHandle } from "./SourceHandle";
import { NodeShape } from "./NodeShape";
import { NodeTooltip } from "./NodeTooltip";
import { NodeTooltipSection } from "./NodeTooltipSection";
import { useNodeAdd } from "./hooks/useNodeAdd";

export const ChoiceNode = ({
  data: {
    id,
    description,
    type,
    isDropTarget,
    isValidDropTarget,
    handleClickNode,
    isChoiceChild,
    userCanEdit,
    children,
    mergeOption,
    merging,
    handleMerge,
    mergeable,
    shapeHeight,
    shapeWidth,
  },
  dragging,
}: NodeProps<NodeData>) => {
  const [hovering, setHovering] = useState(false);
  const [hoveringShape, setHoveringShape] = useState(false);
  const { addNode, isNodeButtonDisabled } = useNodeAdd();
  const connectionNodeId = useStore((state) => state.connectionNodeId);
  const lastChild = children[children?.length - 1];

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
                addNode(
                  lastChild || id,
                  NodeTypes.subActivity,
                  lastChild ? Position.Right : Position.Bottom
                )
              }
              disabled={isNodeButtonDisabled(id, Position.Bottom)}
            />
            <ChoiceButton
              onClick={() =>
                addNode(
                  lastChild || id,
                  NodeTypes.choice,
                  lastChild ? Position.Right : Position.Bottom
                )
              }
              disabled={isNodeButtonDisabled(id, Position.Bottom)}
            />
            <WaitingButton
              onClick={() =>
                addNode(
                  lastChild || id,
                  NodeTypes.waiting,
                  lastChild ? Position.Right : Position.Bottom
                )
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
      onMouseEnter={() => {
        !dragging && setHovering(true);
      }}
      onMouseLeave={() => setHovering(false)}
    >
      <NodeCard
        onClick={handleClickNode}
        hovering={hovering && !merging}
        highlighted={isDropTarget && isValidDropTarget}
        darkened={isValidDropTarget === false}
      >
        <NodeShape
          shape={"rhombus"}
          color={colors.NODE_CHOICE}
          width={shapeWidth}
          height={shapeHeight}
          onMouseEnter={() => !dragging && setHoveringShape(true)}
          onMouseLeave={() => setHoveringShape(false)}
        >
          <NodeDescription
            header={!description ? type : undefined}
            description={description}
          />
        </NodeShape>
      </NodeCard>
      <TargetHandle hidden={!mergeOption} />
      <SourceHandle />
      <NodeTooltip isVisible={!!(hoveringShape && description)}>
        {description && (
          <NodeTooltipSection header={"Description"} text={description} />
        )}
      </NodeTooltip>
      {renderNodeButtons()}
    </div>
  );
};
