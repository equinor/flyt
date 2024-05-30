import { Button, Icon } from "@equinor/eds-core-react";
import { close_circle_outlined } from "@equinor/eds-icons";
import { BaseEdge, EdgeLabelRenderer, EdgeProps } from "reactflow";
import styles from "./Edge.module.scss";
import { getSvgStraightLineData } from "./drawSvgPath";

export const DeletableEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
  data,
}: EdgeProps) => {
  const points = [
    { x: sourceX, y: sourceY },
    { x: targetX, y: targetY },
  ];

  data?.points && points.splice(1, 0, ...data.points);

  const [edgePath, labelX, labelY] = getSvgStraightLineData(points);

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
            <Button variant="ghost_icon" onClick={() => data?.onDelete(id)}>
              <Icon data={close_circle_outlined} size={24} />
            </Button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
