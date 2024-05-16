import { useProjectId } from "../../../hooks/useProjectId";
import { useEffect } from "react";
import { useReactFlow, FitViewOptions } from "reactflow";

export const useCenterCanvas = () => {
  const reactFlow = useReactFlow();
  const { fitView, setViewport, getViewport } = reactFlow;
  const { projectId } = useProjectId();
  const fitViewOptions: FitViewOptions = {
    includeHiddenNodes: true,
    maxZoom: 0.8,
  };

  useEffect(() => {
    window.requestAnimationFrame(() => {
      fitView(fitViewOptions);
      const viewport = getViewport();
      setViewport({ ...viewport, y: 75 });
    });
  }, [reactFlow, projectId]);
};
