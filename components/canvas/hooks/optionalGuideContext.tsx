import type { OptionalStageEntry } from "@/hooks/useOptionalGuide";
import { NodeTypes } from "@/types/NodeTypes";
import { createContext, type PropsWithChildren, useContext } from "react";

type OptionalGuideContextValue = {
  currentStage?: OptionalStageEntry | undefined;
  moveToNextStage: () => void;
  skipCurrentGuide: () => void;
  moveToPreviousStage: () => void;
  openStageFromNodeType: (nodeType: NodeTypes) => void;
};

const noop = () => undefined;

const OptionalGuideContext = createContext<OptionalGuideContextValue>({
  currentStage: undefined,
  moveToNextStage: noop,
  skipCurrentGuide: noop,
  moveToPreviousStage: noop,
  openStageFromNodeType: noop,
});

export const OptionalGuideProvider = ({
  value,
  children,
}: PropsWithChildren<{ value: OptionalGuideContextValue }>) => (
  <OptionalGuideContext.Provider value={value}>
    {children}
  </OptionalGuideContext.Provider>
);

export const useOptionalGuideContext = () => useContext(OptionalGuideContext);
