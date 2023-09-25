import React from "react";
import styles from "./CardButtons.module.scss";
import { Handle, Position } from "reactflow";

export const MergeEndButton = (props) => (
  <Handle
    className={!props.hidden ? styles["handle--merge-end"] : styles.handle}
    type="target"
    position={Position.Top}
    isConnectable={!props.hidden}
    isConnectableStart={false}
  />
);
