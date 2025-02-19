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
  const calculateTooltipPosition = (toolTipHeight: number) => {
    const appHeaderSpace = 70;
    if (!toolTipRef?.current) return;
    const viewPortBottom = toolTipRef.current.getBoundingClientRect().bottom;
    const nodeHeight = nodeRef?.current?.getBoundingClientRect().height;
    const availableSpace = viewPortBottom - (nodeHeight ?? 0) - appHeaderSpace;
    if (toolTipHeight > availableSpace) {
      setTooltipPosition(Position.Bottom);
      setoffset(30);
    } else {
      setTooltipPosition(Position.Top);
      setoffset(10);
    }
  };

  useLayoutEffect(() => {
    const tooltipNode = document.querySelector(".react-flow__node-toolbar");
    if (!tooltipNode) return;
    const calculatePositionIfNeeded = () => {
      const hasChildren =
        (tooltipNode.querySelector("div")?.childElementCount ?? 0) > 0;
      const toolTipHeight = tooltipNode.getBoundingClientRect().height;
      if (hasChildren && toolTipHeight) {
        calculateTooltipPosition(toolTipHeight);
        return true;
      }
      return false;
    };
    // Check initially if tooltipNode DOM has updated data to calculate position
    if (calculatePositionIfNeeded()) return;
    const observer = new MutationObserver(() => {
      if (calculatePositionIfNeeded()) observer.disconnect(); //disconnect observer when position is calculated
    });

    observer.observe(tooltipNode, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [isVisible, toolTipRef, isEditing]);

  return (
    <div ref={toolTipRef}>
      <NodeToolbar
        position={tooltipPosition}
        isVisible={isVisible}
        className={styles.container}
        onMouseDownCapture={(e) => {
          e.stopPropagation();
          if (
            e.target instanceof HTMLElement &&
            e.target.getAttribute("role") === "listbox"
          ) {
            e.preventDefault();
          }
        }}
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

type NodeTooltipProps = {
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
