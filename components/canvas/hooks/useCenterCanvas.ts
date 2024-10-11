import { useCallback, useEffect } from "react";
import { FitViewOptions, useReactFlow } from "reactflow";
import { useProjectId } from "../../../hooks/useProjectId";

export const useCenterCanvas = () => {
  const { fitView, setViewport, getViewport } = useReactFlow();
  const { projectId } = useProjectId();
  const fitViewOptions: FitViewOptions = {
    includeHiddenNodes: true,
    maxZoom: 0.8,
  };

  const centerCanvas = useCallback(() => {
    window.requestAnimationFrame(() => {
      fitView(fitViewOptions);
      const viewport = getViewport();
      setViewport({ ...viewport, y: 75 });
    });
  }, [fitView, getViewport, setViewport]);

  useEffect(() => {
    centerCanvas();
  }, [centerCanvas, projectId]);

  return { centerCanvas };
};
