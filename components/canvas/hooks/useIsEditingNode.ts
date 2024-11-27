import { useCanvasType } from "./useCanvasType";

export const useIsEditingNode = (selected: boolean) => {
  const canvasType = useCanvasType();
  return canvasType === "main" && selected;
};
