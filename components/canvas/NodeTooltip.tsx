import { Typography } from "@equinor/eds-core-react";
import { NodeToolbar, Position } from "reactflow";
import styles from "./NodeTooltip.module.scss";

type NodeTooltip = {
  text: string;
  isVisible?: boolean;
  position?: Position;
};

export const NodeTooltip = ({ text, isVisible, position }: NodeTooltip) => {
  return (
    <NodeToolbar
      position={position}
      isVisible={isVisible}
      className={styles.container}
    >
      <Typography variant="body_long">{text}</Typography>
    </NodeToolbar>
  );
};
