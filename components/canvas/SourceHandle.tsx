import styles from "./NodeButtons.module.scss";
import { Handle, Position } from "reactflow";

export const SourceHandle = () => (
  <Handle
    className={styles["handle--hidden"]}
    type="source"
    position={Position.Bottom}
    isConnectable={false}
    isConnectableEnd={false}
  />
);
