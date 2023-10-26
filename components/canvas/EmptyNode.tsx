import { Handle, Position } from "reactflow";
import styles from "./Node.module.scss";

export const EmptyNode = () => (
  <div className={styles.container}>
    <div className={`${styles.node} ${styles["node--empty"]}`}>
      <Handle
        className={styles.handle}
        type="target"
        position={Position.Top}
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
