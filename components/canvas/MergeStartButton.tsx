import styles from "./CardButtons.module.scss";
import { CardButtonMerge } from "../../types/CardButton";
import { Handle, Position, Connection } from "reactflow";

export const MergeStartButton = (props: CardButtonMerge) => (
  <div
    className={`${styles["cardButton--container"]} ${styles["cardButton--container--merge"]}`}
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
