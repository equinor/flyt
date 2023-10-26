import styles from "./NodeButtons.module.scss";
import { NodeButtonMerge } from "../../types/NodeButton";
import { Handle, Position, Connection } from "reactflow";

export const MergeStartButton = (props: NodeButtonMerge) => (
  <div
    className={`${styles["nodeButton--container"]} ${styles["nodeButton--container--merge"]}`}
    title="Merge"
  >
    <Handle
      type="source"
      position={Position.Bottom}
      onConnect={(e: Connection) => props.onConnect(e)}
      className={`${styles["handle--merge-start"]}`}
    />
  </div>
);
