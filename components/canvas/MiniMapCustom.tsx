import { MiniMap, MiniMapNodeProps, Node, useReactFlow } from "reactflow";
import { NodeTypes } from "@/types/NodeTypes";
import colors from "../../theme/colors";
import styles from "./MiniMapCustom.module.scss";

export function MiniMapCustom() {
  const nodeColor = (node: Node) => {
    switch (node.type) {
      case NodeTypes.mainActivity:
        return colors.NODE_MAINACTIVITY;
      case NodeTypes.subActivity:
        return colors.NODE_SUBACTIVITY;
      case NodeTypes.choice:
        return colors.NODE_CHOICE;
      case NodeTypes.waiting:
        return colors.NODE_WAITING;
      case NodeTypes.hidden:
        return colors.WHITE;
      default:
        return colors.NODE_GENERIC;
    }
  };

  const nodeShape = ({ id, x, y, width, height, color }: MiniMapNodeProps) => {
    const { getNode } = useReactFlow();

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        transform={
          getNode(id)?.type === NodeTypes.choice
            ? `rotate(45 ${x + width / 2} ${y + height / 2})`
            : ""
        }
      />
    );
  };

  return (
    <MiniMap
      className={styles.minimap}
      nodeColor={nodeColor}
      nodeComponent={nodeShape}
      position={"bottom-left"}
      ariaLabel={"Flyt mini map"}
      pannable
      zoomable
      inversePan
    />
  );
}
