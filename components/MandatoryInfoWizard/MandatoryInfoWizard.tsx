import { Button, Dialog, Scrim, Typography } from "@equinor/eds-core-react";
import { useState } from "react";

import { Project } from "@/types/Project";
import { createOptionalGuide } from "@/hooks/useOptionalGuide";

import { AddNameStage } from "./AddNameStage";
import { GiveAccessStage } from "./GiveAccessStage";
import { AddLabelsStage } from "./AddLabelsStage";
import { MandatoryInfoStage } from "./types";

type Props = {
  project: Project;
  onDiscard: () => void;
  updateProjectName: (name: string) => Promise<void>;
};

export function MandatoryInfoWizard({
  project,
  updateProjectName,
  onDiscard,
}: Props) {
  const threshold = new Date();
  threshold.setMinutes(threshold.getMinutes() - 1);

  const isNew =
    Date.parse(project.created) > threshold.getTime() &&
    (!project.name?.trim() ||
      project.name.trim().toLowerCase() === "untitled process");

  const [newName, setNewName] = useState<string>();
  const [showWizard, setShowWizard] = useState<boolean>(isNew);

  const [stage, setStage] = useState<MandatoryInfoStage>("addName");

  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);

  const moveBack = () => {
    switch (stage) {
      case "giveAccesses":
        setStage("addName");
        break;

      case "addLabels":
        setStage("giveAccesses");
        break;
    }
  };

  const moveForward = async () => {
    switch (stage) {
      case "addName":
        await updateProjectName(newName ?? "");
        setStage("giveAccesses");
        break;

      case "giveAccesses":
        setStage("addLabels");
        break;

      case "addLabels":
        createOptionalGuide(project.vsmProjectID.toString());

        window.dispatchEvent(new CustomEvent("flyt-start-optional-guide"));

        setShowWizard(false);
        break;
    }
  };

  return (
    <>
      <Dialog
        open={showDiscardConfirmation}
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 300,
          width: "max(50vw, 400px)",
          gap: 32,
        }}
      >
        <Dialog.Header
          style={{
            padding: 0,
            display: "flex",
            alignItems: "center",
            border: "1px solid #dcdcdc",
          }}
        >
          <Dialog.Title
            style={{
              padding: "24px 40px",
            }}
          >
            <Typography variant="h2">Discard process?</Typography>
          </Dialog.Title>
        </Dialog.Header>

        <Dialog.CustomContent
          style={{
            padding: "0 40px",
            minHeight: 0,
          }}
        >
          <Typography>
            The process and all entered information will be permanently deleted.
          </Typography>

          <Typography>This action cannot be undone.</Typography>
        </Dialog.CustomContent>

        <Dialog.Actions
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #dcdcdc",
            padding: "16px 40px",
          }}
        >
          <Button onClick={() => setShowDiscardConfirmation(false)}>
            Go Back
          </Button>

          <Button variant="outlined" color="danger" onClick={onDiscard}>
            Discard Process
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Scrim
        open={!showDiscardConfirmation && showWizard}
        onWheel={(e) => e.stopPropagation()}
      >
        {stage === "addName" && (
          <AddNameStage
            onNameChange={setNewName}
            onNext={moveForward}
            onRequestDiscard={() => setShowDiscardConfirmation(true)}
            isNextDisabled={
              !newName || newName.toLowerCase() === "untitled process"
            }
          />
        )}

        {stage === "giveAccesses" && (
          <GiveAccessStage
            project={project}
            processName={project.name ?? "Untitled Process"}
            onBack={moveBack}
            onNext={moveForward}
            onRequestDiscard={() => setShowDiscardConfirmation(true)}
          />
        )}

        {stage === "addLabels" && (
          <AddLabelsStage
            project={project}
            processName={project.name ?? "Untitled Process"}
            onBack={moveBack}
            onFinish={moveForward}
            onRequestDiscard={() => setShowDiscardConfirmation(true)}
          />
        )}
      </Scrim>
    </>
  );
}
