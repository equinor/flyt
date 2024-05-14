import { Button, Icon } from "@equinor/eds-core-react";
import { close_circle_outlined } from "@equinor/eds-icons";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from "reactflow";
import styles from "./Edge.module.scss";
import { useEdgeDelete } from "./hooks/useEdgeDelete";

export const DeletableEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const { mutate: deleteEdge } = useEdgeDelete();

  return (
    <>
      <BaseEdge path={edgePath} />
      {selected && (
        <EdgeLabelRenderer>
          <div
            className={`${styles["edge-button-container"]} nodrag nopan`}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            <Button
              variant="ghost_icon"
              onClick={() => deleteEdge({ edgeId: id })}
            >
              <Icon data={close_circle_outlined} size={24} />
            </Button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
