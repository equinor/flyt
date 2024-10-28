import { NodeDataCommon } from "@/types/NodeData";
import { ReactNode } from "react";
import { NodeToolbar, Position } from "reactflow";
import styles from "./NodeTooltip.module.scss";
import { NodeTooltipSection } from "./NodeTooltipSection";

type NodeTooltipContainerProps = {
  children: ReactNode;
  isVisible?: boolean;
  position?: Position;
};

export const NodeTooltipContainer = ({
  children,
  isVisible,
  position,
}: NodeTooltipContainerProps) => {
  return (
    <NodeToolbar
      position={position}
      isVisible={isVisible}
      className={styles.container}
    >
      {children}
    </NodeToolbar>
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

type NodeTooltipProps = Pick<NodeTooltipContainerProps, "position"> & {
  nodeData: NodeDataCommon;
  isHovering?: boolean;
  isEditing?: boolean;
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
  position,
  nodeData,
}: NodeTooltipProps) => {
  return (
    <NodeTooltipContainer
      isVisible={isHovering || isEditing}
      position={position}
    >
      {includeDescription && (
        <NodeTooltipSection
          nodeData={nodeData}
          header={"Description"}
          text={description}
          variant="description"
          isEditing={isEditing}
        />
      )}
      {includeRole && (
        <NodeTooltipSection
          nodeData={nodeData}
          header={"Role(s)"}
          text={role}
          variant="role"
          isEditing={isEditing}
        />
      )}
      {includeDuration && (
        <NodeTooltipSection
          header={"Duration"}
          variant="duration"
          nodeData={nodeData}
          text={duration}
          isEditing={isEditing}
        />
      )}
      {includeEstimate && (
        <NodeTooltipSection
          header={"Duration"}
          text={estimate}
          variant="duration"
          nodeData={nodeData}
        />
      )}
    </NodeTooltipContainer>
  );
};
