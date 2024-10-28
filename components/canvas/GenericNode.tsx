import { NodeData } from "types/NodeData";
import { useState, useEffect } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import stylesNodeButtons from "./NodeButtons.module.scss";
import { NodeButtonsContainer } from "./NodeButtonsContainer";
import { MainActivityButton } from "./MainActivityButton";
import { NodeTypes } from "types/NodeTypes";
import { NodeDescription } from "./NodeDescription";
import { NodeCard } from "./NodeCard";
import colors from "theme/colors";
import { QIPRContainer } from "./QIPRContainer";
import { NodeShape } from "./NodeShape";
import { NodeTooltip, NodeTooltipContainer } from "./NodeTooltip";
import { NodeTooltipSection } from "./NodeTooltipSection";
import { getNodeHelperText } from "./utils/getNodeHelperText";
import { useNodeAdd } from "./hooks/useNodeAdd";
import { useSelectedNodeForEditing } from "./hooks/useSelectedNodeForEditing";

export const GenericNode = ({ data, dragging }: NodeProps<NodeData>) => {
  const {
    id,
    description,
    type,
    tasks,
    isValidDropTarget,
    isDropTarget,
    handleClickNode,
    userCanEdit,
    merging,
    shapeHeight,
    shapeWidth,
  } = data;

  const [hovering, setHovering] = useState(false);
  const [hoveringShape, setHoveringShape] = useState(false);
  const { addNode, isNodeButtonDisabled } = useNodeAdd();
  const { selectedNodeForEditing, setSelectedNodeForEditing } =
    useSelectedNodeForEditing();
  const isEditingNode = selectedNodeForEditing === id;

  useEffect(() => {
    setHovering(false);
    setHoveringShape(false);
  }, [dragging]);

  const nodeHelperText = getNodeHelperText(type);

  const shouldDisplayQIPR = tasks.length > 0 || hovering;

  const renderNodeButtons = () => {
    const nodeButtonsPosition =
      type === NodeTypes.input
        ? Position.Right
        : type === NodeTypes.output
        ? Position.Left
        : undefined;
    if (userCanEdit && hovering && !merging && nodeButtonsPosition) {
      return (
        <NodeButtonsContainer position={nodeButtonsPosition}>
          <MainActivityButton
            onClick={() =>
              addNode(id, { type: NodeTypes.mainActivity }, nodeButtonsPosition)
            }
            disabled={isNodeButtonDisabled(id, nodeButtonsPosition)}
          />
        </NodeButtonsContainer>
      );
    }
  };

  return (
    <div
      onMouseEnter={() => !dragging && setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <NodeCard
        onClick={() => setSelectedNodeForEditing(id)}
        hovering={hovering && !merging}
        highlighted={isDropTarget && isValidDropTarget}
        darkened={isValidDropTarget === false}
      >
        <NodeShape
          shape={"square"}
          color={colors.NODE_GENERIC}
          width={shapeWidth}
          height={shapeHeight}
          onMouseEnter={() => !dragging && setHoveringShape(true)}
          onMouseLeave={() => setHoveringShape(false)}
        >
          <NodeDescription
            header={type}
            description={description}
            helperText={nodeHelperText}
          />
        </NodeShape>
        {shouldDisplayQIPR && (
          <QIPRContainer tasks={tasks} onClick={handleClickNode} />
        )}
      </NodeCard>
      <Handle
        className={stylesNodeButtons["handle--hidden"]}
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
      <NodeTooltip
        isHovering={hoveringShape && !!description}
        isEditing={isEditingNode}
        nodeData={data}
        includeDescription
        description={description}
        includeRole={false}
        includeDuration={false}
        includeEstimate={false}
      />
      {renderNodeButtons()}
    </div>
  );
};
