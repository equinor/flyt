import styles from "./NodeButtons.module.scss";
import { Handle, Position } from "reactflow";

export const SourceHandle = ({ position = Position.Bottom }) => (
  <Handle
    className={styles["handle--hidden"]}
    type="source"
    position={position}
    isConnectable={false}
    isConnectableEnd={false}
  />
);
