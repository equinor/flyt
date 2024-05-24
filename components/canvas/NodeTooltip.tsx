import { ReactNode } from "react";
import { NodeToolbar, Position } from "reactflow";
import styles from "./NodeTooltip.module.scss";

type NodeTooltip = {
  children: ReactNode;
  isVisible?: boolean;
  position?: Position;
};

export const NodeTooltip = ({ children, isVisible, position }: NodeTooltip) => {
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
