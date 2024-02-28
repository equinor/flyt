import { useEffect, useState } from "react";
import { Connection, Position, useStore } from "reactflow";
import { formatDuration } from "types/unitDefinitions";
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

export const WaitingNode = ({
  data: {
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
    handleClickAddNode,
    userCanEdit,
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
        height={shapeHeight}
        width={shapeWidth}
        color={colors.NODE_WAITING}
        tasks={tasks}
        onClick={handleClickNode}
        hovering={hovering && !merging}
        highlighted={isDropTarget && isValidDropTarget}
        darkened={isValidDropTarget === false}
      >
        <NodeDescription header={type} />
        <div className={styles["node__waitingtime-container"]}>
          <Icon data={timeIcon} size={24} style={{ marginRight: 5 }} />
          <Typography variant="caption">
            {formatDuration(duration, unit)}
          </Typography>
        </div>
        <TargetHandle hidden={!mergeOption} />
        <SourceHandle />
      </NodeCard>
      {renderNodeButtons()}
    </div>
  );
};
