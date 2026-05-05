import styles from "./NodeButtons.module.scss";
import { Handle, Position } from "@xyflow/react";

export const TargetHandle = ({ position = Position.Top, hidden = false }) => (
  <Handle
    className={hidden ? styles.handle : styles["handle--merge-end"]}
    type="target"
    position={position}
    isConnectable={!hidden}
    isConnectableStart={false}
  />
);
