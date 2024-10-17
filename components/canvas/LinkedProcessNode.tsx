import { formatDateTimeString } from "@/utils/formatUpdated";
import { useEffect, useState } from "react";
import { Connection, NodeProps, Position, useStore } from "reactflow";
import colors from "theme/colors";
import { NodeDataCommon } from "types/NodeData";
import { NodeTypes } from "types/NodeTypes";
import { ChoiceButton } from "./ChoiceButton";
import { useNodeAdd } from "./hooks/useNodeAdd";
import { MergeButton } from "./MergeButton";
import styles from "./Node.module.scss";
import { NodeButtonsContainer } from "./NodeButtonsContainer";
import { NodeCard } from "./NodeCard";
import { NodeDescription } from "./NodeDescription";
import { NodeShape } from "./NodeShape";
import { NodeTooltip } from "./NodeTooltip";
import { NodeTooltipSection } from "./NodeTooltipSection";
import { NodeUserDots } from "./NodeUserDots";
import { SourceHandle } from "./SourceHandle";
import { SubActivityButton } from "./SubActivityButton";
import { TargetHandle } from "./TargetHandle";
import { fullNameListToString } from "./utils/fullnameListToString";
import {
  isChoiceChild,
  isMainActivityColumn,
} from "./utils/nodeRelationsHelper";
import { WaitingButton } from "./WaitingButton";

export const LinkedProcessNode = ({
  data: {
    id,
    linkedProjectData,
    column,
    isValidDropTarget,
    isDropTarget,
    merging,
    mergeOption,
    handleClickNode,
    handleMerge,
    parentTypes,
    userCanEdit,
    mergeable,
    shapeHeight,
    shapeWidth,
    disabled,
  },
  selected,
  dragging,
}: NodeProps<NodeDataCommon>) => {
  const [hovering, setHovering] = useState(false);
  const [hoveringShape, setHoveringShape] = useState(false);
  const connectionNodeId = useStore((state) => state.connectionNodeId);
  const { addNode, isNodeButtonDisabled } = useNodeAdd();

  const name = linkedProjectData?.name;
  const userAccesses = linkedProjectData?.userAccesses;
  const fullNames = userAccesses && fullNameListToString(userAccesses);
  const formattedUpdated =
    linkedProjectData?.updated &&
    formatDateTimeString(linkedProjectData.updated);

  useEffect(() => {
    setHovering(false);
    setHoveringShape(false);
  }, [dragging, connectionNodeId]);

  const renderNodeButtons = () => {
    if (userCanEdit && hovering && !merging && isMainActivityColumn(column)) {
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
          {isChoiceChild(parentTypes) && (
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
          color={colors.WHITE}
          width={shapeWidth}
          height={shapeHeight}
          className={styles["node-shape-container--linkedProcess"]}
          onMouseEnter={() => !dragging && setHoveringShape(true)}
          onMouseLeave={() => setHoveringShape(false)}
        >
          <NodeDescription
            header={name ?? undefined}
            helperText={formattedUpdated}
          />
          {userAccesses && (
            <NodeUserDots
              userAccesses={userAccesses}
              onClick={handleClickNode}
            />
          )}
        </NodeShape>
      </NodeCard>
      <TargetHandle hidden={!mergeOption} />
      <SourceHandle />
      <NodeTooltip isVisible={hoveringShape}>
        {name && <NodeTooltipSection header={"Title"} text={name} />}
        {formattedUpdated && (
          <NodeTooltipSection header={"Last Updated"} text={formattedUpdated} />
        )}
        {fullNames && <NodeTooltipSection header={"Users"} text={fullNames} />}
      </NodeTooltip>
      {renderNodeButtons()}
    </div>
  );
};
