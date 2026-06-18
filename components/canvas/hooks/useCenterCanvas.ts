import { FitViewOptions, useNodesInitialized, useReactFlow } from "reactflow";
import { useProjectId } from "@/hooks/useProjectId";
import { useCallback, useEffect, useState } from "react";

export const useCenterCanvas = (
  fitViewOptions: FitViewOptions = {
    includeHiddenNodes: true,
    maxZoom: 0.8,
  }
) => {
  const { projectId } = useProjectId();
  const { fitView, setViewport, getViewport } = useReactFlow();
  const [isInitialized, setIsInitialized] = useState(false);
  const nodesInitialized = useNodesInitialized();

  const centerCanvas = useCallback(() => {
    fitView(fitViewOptions);
    const viewport = getViewport();
    setViewport({ ...viewport, y: 75 });
  }, [fitView, getViewport, setViewport, fitViewOptions]);

  useEffect(() => {
    setIsInitialized(false);
  }, [projectId]);

  useEffect(() => {
    if (nodesInitialized && !isInitialized) {
      setIsInitialized(true);
      centerCanvas();
    }
  }, [nodesInitialized]);

  return { centerCanvas };
};
