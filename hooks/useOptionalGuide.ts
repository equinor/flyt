import { useEffect, useState } from "react";
import { NodeTypes } from "@/types/NodeTypes";

export type OptionalGuideStage =
  | "output"
  | "customer"
  | "input"
  | "supplier"
  | "main activity";

export type OptionalStageEntry = {
  stage: OptionalGuideStage;
  isCompleted: boolean;
  step: number;
};

export type OptionalGuide = {
  projectId: string;
  status: "active" | "skipped" | "completed";
  stages: OptionalStageEntry[];
};

const STAGE_BY_NODE_TYPE: Partial<Record<NodeTypes, OptionalGuideStage>> = {
  [NodeTypes.output]: "output",
  [NodeTypes.customer]: "customer",
  [NodeTypes.input]: "input",
  [NodeTypes.supplier]: "supplier",
  [NodeTypes.mainActivity]: "main activity",
};

export const toStageFromNodeType = (
  nodeType: NodeTypes
): OptionalGuideStage | undefined => STAGE_BY_NODE_TYPE[nodeType];

const;

function initializeOptionalGuide(projectId: string): OptionalGuide {
  const storageKey = `guideStage:${projectId}`;
  const storedState = localStorage.getItem(storageKey);
  if (storedState) {
    return JSON.parse(storedState) as OptionalGuide;
  }
  const initialGuide: OptionalGuide = {
    projectId,
    status: "active",
    stages: [
      { stage: "output", isCompleted: false, step: 1 },
      { stage: "customer", isCompleted: false, step: 2 },
      { stage: "input", isCompleted: false, step: 3 },
      { stage: "supplier", isCompleted: false, step: 4 },
      { stage: "main activity", isCompleted: false, step: 5 },
    ],
  };

  localStorage.setItem(storageKey, JSON.stringify(initialGuide));
  return initialGuide;
}

function markStageAsCompleted(
  projectId: string,
  currentStage: OptionalGuideStage
) {
  const storageKey = `guideStage:${projectId}`;
  const guide = JSON.parse(
    localStorage.getItem(storageKey) ?? ""
  ) as OptionalGuide;
  if (!guide)
    throw new Error("Guide state not found for project: " + projectId);

  const newEntries = guide.stages.map((stageEntry) => ({
    ...stageEntry,
    isCompleted: stageEntry.isCompleted || stageEntry.stage === currentStage,
  }));

  localStorage.setItem(
    storageKey,
    JSON.stringify({
      ...guide,
      stages: newEntries,
      status:
        guide.status !== "skipped" &&
        newEntries.every((entry) => entry.isCompleted)
          ? "completed"
          : guide.status,
    })
  );
}

function skipGuide(projectId: string, currentStage: OptionalGuideStage) {
  const storageKey = `guideStage:${projectId}`;
  const guide = JSON.parse(
    localStorage.getItem(storageKey) ?? ""
  ) as OptionalGuide;
  if (!guide)
    throw new Error("Guide state not found for project: " + projectId);

  localStorage.setItem(
    storageKey,
    JSON.stringify({
      ...guide,
      status: "skipped",
      stages: guide.stages.map((stage) => ({
        ...stage,
        isCompleted: stage.stage === currentStage || stage.isCompleted,
      })),
    })
  );
}

function findNextStage(
  projectId: string,
  currentStage: OptionalGuideStage
): OptionalStageEntry | undefined {
  const storageKey = `guideStage:${projectId}`;
  const guide = JSON.parse(
    localStorage.getItem(storageKey) ?? ""
  ) as OptionalGuide;
  if (!guide)
    throw new Error("Guide state not found for project: " + projectId);

  const currentStageEntry = guide.stages.find(
    (entry) => entry.stage === currentStage
  );
  if (!currentStageEntry)
    throw new Error("Current stage not found in guide stages: " + currentStage);

  const nextStages = guide.stages
    .filter((entry) => entry.stage !== currentStageEntry.stage)
    .sort((a, b) => a.step - b.step);

  return nextStages.length > 0 ? nextStages[0] : undefined;
}

function findPreviousStage(
  projectId: string,
  currentStage: OptionalGuideStage
): OptionalStageEntry | undefined {
  const storageKey = `guideStage:${projectId}`;
  const guide = JSON.parse(
    localStorage.getItem(storageKey) ?? ""
  ) as OptionalGuide;
  if (!guide)
    throw new Error("Guide state not found for project: " + projectId);

  const currentStageEntry = guide.stages.find(
    (entry) => entry.stage === currentStage
  );
  if (!currentStageEntry)
    throw new Error("Current stage not found in guide stages: " + currentStage);

  const previousStages = guide.stages
    .filter((entry) => entry.stage !== currentStageEntry.stage)
    .sort((a, b) => b.step - a.step);

  return previousStages.length > 0 ? previousStages[0] : undefined;
}

function openStage(
  projectId: string,
  stageToOpen: OptionalGuideStage
): OptionalStageEntry {
  const storageKey = `guideStage:${projectId}`;
  const guide = JSON.parse(
    localStorage.getItem(storageKey) ?? ""
  ) as OptionalGuide;
  if (!guide)
    throw new Error("Guide state not found for project: " + projectId);

  return guide.stages.find((stage) => stage.stage === stageToOpen)!;
}

export function useOptionalGuideStage(processId: string) {
  const [currentStage, setCurrentStage] = useState<
    OptionalStageEntry | undefined
  >();

  useEffect(() => {
    const guide = initializeOptionalGuide(processId);
    if (guide.status === "skipped" || guide.status === "completed") {
      setCurrentStage(undefined);
      return;
    }

    const firstStage = guide.stages
      .sort((a, b) => a.step - b.step)
      .find((stage) => !stage.isCompleted);
    setCurrentStage(firstStage);
  }, [processId]);

  const moveToNextStage = () => {
    if (!currentStage) return;
    markStageAsCompleted(processId, currentStage.stage);
    setCurrentStage(findNextStage(processId, currentStage.stage));
  };

  const moveToPreviousStage = () => {
    if (!currentStage) return;
    const previousStage = findPreviousStage(processId, currentStage.stage);
    setCurrentStage(previousStage);
  };

  const skipCurrentGuide = () => {
    if (!currentStage) return;
    skipGuide(processId, currentStage.stage);
    setCurrentStage(undefined);
  };

  const openStageFromNodeType = (nodeType: NodeTypes) => {
    const stageToOpen = toStageFromNodeType(nodeType);
    if (!stageToOpen) return;

    const stageEntry = openStage(processId, stageToOpen);
    setCurrentStage(stageEntry);
  };

  return {
    currentStage,
    moveToNextStage,
    moveToPreviousStage,
    skipCurrentGuide,
    openStageFromNodeType,
  };
}
