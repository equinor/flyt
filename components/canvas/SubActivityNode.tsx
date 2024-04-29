import React, { useEffect, useState } from "react";
import { Connection, Position, useStore } from "reactflow";
import { formatNodeText } from "./utils/formatNodeText";
import { formatDuration } from "types/unitDefinitions";
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
import { Typography } from "@equinor/eds-core-react";
import { SourceHandle } from "./SourceHandle";

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
    handleClickAddNode,
    userCanEdit,
    mergeable,
    shapeHeight,
    shapeWidth,
  },
  dragging,
}: NodeProps<NodeData>) => {
  const [hovering, setHovering] = useState(false);
  const connectionNodeId = useStore((state) => state.connectionNodeId);

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
      onMouseEnter={() => !dragging && setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <NodeCard
        shape="square"
        width={shapeWidth}
        height={shapeHeight}
        color={colors.NODE_SUBACTIVITY}
        tasks={tasks}
        onClick={handleClickNode}
        hovering={hovering && !merging}
        highlighted={isDropTarget && isValidDropTarget}
        darkened={isValidDropTarget === false}
      >
        <NodeDescription
          header={!description ? type : undefined}
          description={description}
        />
        <div className={styles["node__role-container"]}>
          <Typography variant="caption" className={styles["node__info-text"]}>
            {formatNodeText(role ?? "")}
          </Typography>
        </div>
        <div className={styles["node__time-container"]}>
          <Typography variant="caption" className={styles["node__info-text"]}>
            {formatDuration(duration, unit)}
          </Typography>
        </div>
      </NodeCard>
      <TargetHandle hidden={!mergeOption} />
      <SourceHandle />
      {renderNodeButtons()}
    </div>
  );
};
