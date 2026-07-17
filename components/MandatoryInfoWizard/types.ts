// components/MandatoryInfoWizard/types.ts

import { Project } from "@/types/Project";

export type MandatoryInfoStage = "addName" | "giveAccesses" | "addLabels";

export type AddNameStageProps = {
  onNameChange: (name: string) => void;
  onNext: () => void;
  onRequestDiscard: () => void;
  isNextDisabled: boolean;
};

export type GiveAccessStageProps = {
  project: Project;
  processName: string;
  onBack: () => void;
  onNext: () => void;
  onRequestDiscard: () => void;
};

export type AddLabelsStageProps = {
  project: Project;
  processName: string;
  onBack: () => void;
  onFinish: () => void;
  onRequestDiscard: () => void;
};
