import { MiniMap, Node } from "reactflow";
import { NodeTypes } from "@/types/NodeTypes";
import colors from "../../theme/colors";
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
      default:
        return colors.NODE_GENERIC;
    }
  };

  return (
    <MiniMap
      style={{ marginLeft: 48 }}
      nodeColor={nodeColor}
      position={"bottom-left"}
      ariaLabel={"Flyt mini map"}
      pannable
      zoomable
      inversePan
    />
  );
}
