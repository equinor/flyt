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

export const ChoiceNode = ({
  data: {
    id,
    description,
    type,
    isDropTarget,
    isValidDropTarget,
    handleClickNode,
    isChoiceChild,
    handleClickAddNode,
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
  const connectionNodeId = useStore((state) => state.connectionNodeId);
  const lastChild = children[children?.length - 1];

  useEffect(() => {
    setHovering(false);
  }, [dragging, connectionNodeId]);

  const renderNodeButtons = () => {
    if (userCanEdit && hovering && !merging) {
      return (
        <>
          <NodeButtonsContainer position={Position.Bottom}>
            <SubActivityButton
              onClick={() =>
                handleClickAddNode(
                  lastChild || id,
                  NodeTypes.subActivity,
                  lastChild ? Position.Right : Position.Bottom
                )
              }
            />
            <ChoiceButton
              onClick={() =>
                handleClickAddNode(
                  lastChild || id,
                  NodeTypes.choice,
                  lastChild ? Position.Right : Position.Bottom
                )
              }
            />
            <WaitingButton
              onClick={() =>
                handleClickAddNode(
                  lastChild || id,
                  NodeTypes.waiting,
                  lastChild ? Position.Right : Position.Bottom
                )
              }
            />
            {mergeable && (
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
                    handleClickAddNode(
                      id,
                      NodeTypes.subActivity,
                      Position.Right
                    )
                  }
                />
                <ChoiceButton
                  onClick={() =>
                    handleClickAddNode(id, NodeTypes.choice, Position.Right)
                  }
                />
                <WaitingButton
                  onClick={() =>
                    handleClickAddNode(id, NodeTypes.waiting, Position.Right)
                  }
                />
              </NodeButtonsContainer>
              <NodeButtonsContainer position={Position.Left}>
                <SubActivityButton
                  onClick={() =>
                    handleClickAddNode(id, NodeTypes.subActivity, Position.Left)
                  }
                />
                <ChoiceButton
                  onClick={() =>
                    handleClickAddNode(id, NodeTypes.choice, Position.Left)
                  }
                />
                <WaitingButton
                  onClick={() =>
                    handleClickAddNode(id, NodeTypes.waiting, Position.Left)
                  }
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
        shape="rhombus"
        height={shapeHeight}
        width={shapeWidth}
        color={colors.NODE_CHOICE}
        onClick={handleClickNode}
        hovering={hovering && !merging}
        highlighted={isDropTarget && isValidDropTarget}
        darkened={isValidDropTarget === false}
      >
        <NodeDescription
          header={!description && type}
          description={description}
        />
      </NodeCard>
      <TargetHandle hidden={!mergeOption} />
      <SourceHandle />
      {renderNodeButtons()}
    </div>
  );
};
