import { NodeDataCommon } from "@/types/NodeData";
import { useCanvasType } from "./useCanvasType";
import { useSelectedNodeForPQIRid } from "./useSelectedNodeForPQIRid";

export const useQIPRContainerOnClick = (data: NodeDataCommon) => {
  const canvasType = useCanvasType();
  const { setSelectedNodeForPQIRid } = useSelectedNodeForPQIRid();
  if (canvasType === "select_process_card") return data.handleClickNode;
  return () => setSelectedNodeForPQIRid(data.id);
};
