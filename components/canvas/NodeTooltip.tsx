import { Typography } from "@equinor/eds-core-react";
import { NodeToolbar } from "reactflow";
import styles from "./NodeTooltip.module.scss";

type NodeTooltip = {
  text?: string;
  isVisible?: boolean;
};

export const NodeTooltip = ({ text, isVisible }: NodeTooltip) => {
  return (
    <NodeToolbar isVisible={isVisible} className={styles.container}>
      <Typography variant="body_long">{text}</Typography>
    </NodeToolbar>
  );
};
