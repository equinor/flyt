import React from "react";
import { Handle, Position } from "reactflow";
import styles from "./Card.module.scss";

export const EmptyCard = () => (
  <div className={styles.container}>
    <div className={`${styles.card} ${styles["card--empty"]}`}>
      <Handle
        className={styles.handle}
        type="target"
        position={Position.Bottom}
        isConnectable={false}
      />
      <Handle
        className={styles.handle}
        type="source"
        position={Position.Bottom}
        isConnectable={false}
      />
    </div>
  </div>
);
