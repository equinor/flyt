import { useCanvasType } from "./useCanvasType";

export const useCanAddQIPR = () => {
  const canvasType = useCanvasType();
  return canvasType === "main";
};
