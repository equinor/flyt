import { useEffect, useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import colors from "theme/colors";
import { NodeDataCommon } from "types/NodeData";
import { NodeTypes } from "types/NodeTypes";
import { useNodeAdd } from "./hooks/useNodeAdd";
import { useSelectedNodeForEditing } from "./hooks/useSelectedNodeForEditing";
import { MainActivityButton } from "./MainActivityButton";
import stylesNodeButtons from "./NodeButtons.module.scss";
import { NodeButtonsContainer } from "./NodeButtonsContainer";
import { NodeCard } from "./NodeCard";
import { NodeDescription } from "./NodeDescription";
import { NodeShape } from "./NodeShape";
import { NodeTooltip } from "./NodeTooltip";
import { QIPRContainer } from "./QIPRContainer";
import { SourceHandle } from "./SourceHandle";
import { getNodeHelperText } from "./utils/getNodeHelperText";

export const GenericNode = ({
  data,
  dragging,
  selected,
}: NodeProps<NodeDataCommon>) => {
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
    disabled,
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
      onMouseEnter={() => !disabled && !dragging && setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <NodeCard
        onClick={() => setSelectedNodeForEditing(id)}
        hovering={hovering && !merging}
        highlighted={isDropTarget && isValidDropTarget}
        disabled={disabled || isValidDropTarget === false}
        selected={selected}
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
      <SourceHandle />
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
