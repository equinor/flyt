import { NodeDataCommon } from "@/types/NodeData";
import React, {
  ReactNode,
  RefObject,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { NodeToolbar, NodeToolbarProps, Position } from "reactflow";
import { EditableNodeTooltipSection } from "./EditableNodeTooltipSection";
import styles from "./NodeTooltip.module.scss";

type NodeTooltipContainerProps = {
  children: ReactNode;
  isVisible?: boolean;
  style?: NodeToolbarProps["style"];
  isEditing?: boolean;
  nodeRef?: RefObject<HTMLDivElement>;
};

export const NodeTooltipContainer = ({
  children,
  isVisible,
  style,
  isEditing,
  nodeRef,
}: NodeTooltipContainerProps) => {
  const toolTipRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<Position | undefined>(
    undefined
  );
  const [offset, setoffset] = useState(10);
  useLayoutEffect(() => {
    const tooltipNode = document.querySelector(".react-flow__node-toolbar");
    const appHeaderSpace = 70;
    if (!tooltipNode) setTooltipPosition(undefined);
    if (toolTipRef?.current && tooltipNode) {
      const viewPortBottom = toolTipRef.current.getBoundingClientRect().bottom;
      const toolTipHeight = tooltipNode?.getBoundingClientRect().height;
      const nodeHeight = nodeRef?.current?.getBoundingClientRect().height;
      const availableSpace =
        viewPortBottom - (nodeHeight ?? 0) - appHeaderSpace;
      if (toolTipHeight > availableSpace) {
        setTooltipPosition(Position.Bottom);
        setoffset(30);
      } else {
        setTooltipPosition(Position.Top);
        setoffset(10);
      }
    }
  }, [isVisible, toolTipRef, isEditing]);

  return (
    <div ref={toolTipRef}>
      <NodeToolbar
        position={tooltipPosition}
        isVisible={isVisible}
        className={styles.container}
        onMouseDownCapture={(e) => e.stopPropagation()}
        style={style}
        offset={offset}
      >
        {children}
      </NodeToolbar>
    </div>
  );
};

type Field<IncludeKey extends string, Key extends string> =
  | ({
      [k in IncludeKey]?: false;
    } & {
      [k in Key]?: undefined;
    })
  | ({
      [k in IncludeKey]: true;
    } & {
      [k in Key]: string | undefined;
    });

type NodeTooltipProps = Pick<NodeTooltipContainerProps, "isEditing"> & {
  nodeData: NodeDataCommon;
  isHovering?: boolean;
  isEditing?: boolean;
  nodeRef: RefObject<HTMLDivElement>;
} & Field<"includeDescription", "description"> &
  Field<"includeDuration", "duration"> &
  Field<"includeEstimate", "estimate"> &
  Field<"includeRole", "role">;

export const NodeTooltip = ({
  includeDescription,
  includeDuration,
  includeEstimate,
  includeRole,
  description,
  role,
  duration,
  estimate,
  isHovering,
  isEditing,
  nodeData,
  nodeRef,
}: NodeTooltipProps) => {
  const editingStyle = { minWidth: "300px" };
  const tooltipStyle = isEditing ? editingStyle : undefined;
  const shouldDisplayDescription =
    includeDescription && (isEditing || description);
  const shouldDisplayRole = includeRole && (isEditing || role);
  const shouldDisplayDuration = includeDuration && (isEditing || duration);
  const shouldDisplayEstimate = includeEstimate && estimate;
  return (
    <NodeTooltipContainer
      isVisible={isHovering || isEditing}
      style={tooltipStyle}
      isEditing={isEditing}
      nodeRef={nodeRef}
    >
      {shouldDisplayDescription && (
        <EditableNodeTooltipSection
          nodeData={nodeData}
          header={"Description"}
          text={description}
          variant="description"
          isEditing={isEditing}
        />
      )}
      {shouldDisplayRole && (
        <EditableNodeTooltipSection
          nodeData={nodeData}
          header={"Role(s)"}
          text={role}
          variant="role"
          isEditing={isEditing}
        />
      )}
      {shouldDisplayDuration && (
        <EditableNodeTooltipSection
          header={"Duration"}
          variant="duration"
          nodeData={nodeData}
          text={duration}
          isEditing={isEditing}
        />
      )}
      {shouldDisplayEstimate && (
        <EditableNodeTooltipSection
          header={"Duration"}
          text={estimate}
          variant="duration"
          nodeData={nodeData}
        />
      )}
    </NodeTooltipContainer>
  );
};
