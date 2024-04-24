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
  },
  dragging,
}: NodeProps<NodeData>) => {
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    setHovering(false);
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
        shape="square"
        height={shapeHeight}
        width={shapeWidth}
        color={colors.NODE_MAINACTIVITY}
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
      </NodeCard>
      <Handle
        className={stylesNodeButtons["handle--hidden"]}
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
      <SourceHandle />
      {renderNodeButtons()}
    </div>
  );
};
