import { NodeDataCommon } from "@/types/NodeData";
import { useCanvasType } from "./useCanvasType";
import { useSelectedNodeForQIPR } from "./useSelectedNodeForQIPR";

export const useQIPRContainerOnClick = (data: NodeDataCommon) => {
  const canvasType = useCanvasType();
  const { setSelectedNodeForQIPR } = useSelectedNodeForQIPR();
  if (canvasType === "select_process_card") return data.handleClickNode;
  return () => setSelectedNodeForQIPR(data);
};
