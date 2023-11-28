import styles from "./NodeButtons.module.scss";
import { Handle, Position, Connection } from "reactflow";

export type NodeButtonMerge = {
  onConnect(e: Connection): void;
};

export const MergeButton = (props: NodeButtonMerge) => (
  <div
    className={`${styles["nodeButton__container"]} ${styles["nodeButton__container--merge"]}`}
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
