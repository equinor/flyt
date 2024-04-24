import router from "next/router";
import { useEffect } from "react";
import { useReactFlow, FitViewOptions } from "reactflow";

export const useCenterCanvas = () => {
  const reactFlow = useReactFlow();
  const { fitView, setViewport, getViewport } = reactFlow;
  const { id } = router.query;
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
  }, [reactFlow, id]);
};
