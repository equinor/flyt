import { NodeProps } from "reactflow";
import { NodeData } from "types/NodeData";
import styles from "./Node.module.scss";
import { SourceHandle } from "./SourceHandle";
import { TargetHandle } from "./TargetHandle";

export const HiddenNode = ({
  data: { shapeHeight, shapeWidth },
}: NodeProps<NodeData>) => (
  <div
    style={{ height: shapeHeight, width: shapeWidth }}
    className={`${styles["node--hidden"]}`}
  >
    <TargetHandle hidden={true} />
    <SourceHandle />
  </div>
);
