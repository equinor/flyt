import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
  useOnSelectionChange,
} from "reactflow";
import colors from "../../theme/colors";
import {
  Button,
  Icon,
  Input,
  Popover,
  Typography,
} from "@equinor/eds-core-react";
import { useRef, useState } from "react";
import * as styles from "./ChoiceEdge.module.scss";
import { EdgeLabel } from "@/components/canvas/ChoiceEdgeLabel";
import { edit } from "@equinor/eds-icons";

export function ChoiceEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <EdgeLabel
            id={id}
            labelText={label?.toString()}
            selected={selected}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
