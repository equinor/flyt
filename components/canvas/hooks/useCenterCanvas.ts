import { useCallback, useEffect, useState } from "react";
import { FitViewOptions, useNodesInitialized, useReactFlow } from "reactflow";

export const useCenterCanvas = () => {
  const { fitView, setViewport, getViewport } = useReactFlow();
  const [isInitialized, setIsInitialized] = useState(false);
  const nodesInitialized = useNodesInitialized();
  const fitViewOptions: FitViewOptions = {
    includeHiddenNodes: true,
    maxZoom: 0.8,
  };

  const centerCanvas = useCallback(() => {
    fitView(fitViewOptions);
    const viewport = getViewport();
    setViewport({ ...viewport, y: 75 });
  }, [fitView, getViewport, setViewport]);

  useEffect(() => {
    if (nodesInitialized && !isInitialized) {
      setIsInitialized(true);
      centerCanvas();
    }
  }, [nodesInitialized]);

  return { centerCanvas };
};
