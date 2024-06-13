import { Button, Icon } from "@equinor/eds-core-react";
import { close_circle_outlined } from "@equinor/eds-icons";
import { BaseEdge, EdgeLabelRenderer, EdgeProps } from "reactflow";
import styles from "./Edge.module.scss";
import { getSvgStraightLineData } from "./drawSvgPath";
import { EdgeLabel } from "./EdgeLabel";
import colors from "@/theme/colors";
import { useEffect, useState } from "react";

export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  label,
  selected,
  interactionWidth,
  data,
}: EdgeProps) => {
  const points = [
    { x: sourceX, y: sourceY },
    { x: targetX, y: targetY },
  ];

  data?.points && points.splice(1, 0, ...data.points);

  const [edgePath, labelX, labelY] = getSvgStraightLineData(points);
  const [isEditingText, setIsEditingText] = useState(false);

  useEffect(() => {
    data?.setIsEditingText(isEditingText);
  }, [isEditingText]);

  return (
    <>
      <BaseEdge
        path={edgePath}
        interactionWidth={interactionWidth}
        style={{
          stroke: `${
            selected
              ? colors.EQUINOR_PROMINENT
              : data.hovered
              ? colors.EQUINOR_HOVER
              : colors.EQUINOR_MEDIUM_GRAY
          }`,
        }}
      />
      <EdgeLabelRenderer>
        <div
          className={`${styles["edge-button-container"]} nodrag nopan`}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            zIndex: 1000,
            fontSize: 12,
          }}
        >
          <EdgeLabel
            id={id}
            labelText={label?.toString()}
            selected={selected ?? false}
            readOnly={!data?.userCanEdit || !data?.writable}
            setIsEditingText={setIsEditingText}
          />
          {selected &&
            data?.userCanEdit &&
            data?.onDelete &&
            !isEditingText && (
              <Button variant="ghost_icon" onClick={() => data?.onDelete(id)}>
                <Icon data={close_circle_outlined} size={24} />
              </Button>
            )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
