import type { Project } from "@/types/Project";

import { AddLabelsSection } from "@/components/Labels/ManageLabelBox";
import { AddUserAccessSection } from "@/components/AccessBox";
import {
  Button,
  Icon,
  Scrim,
  TextField,
  Typography,
  Card,
  Dialog,
} from "@equinor/eds-core-react";

import { share, tag } from "@equinor/eds-icons";
import { ChangeEvent, useState } from "react";

type MandatoryInfoStage = "addName" | "giveAccesses" | "addLabels";

type AddNameStageProps = {
  onNameChange: (name: string) => void;
  onNext: () => void;
  onRequestDiscard: () => void;
  isNextDisabled: boolean;
};

function AddNameStage({
  onNameChange,
  onNext,
  onRequestDiscard,
  isNextDisabled,
}: AddNameStageProps) {
  return (
    <Card
      elevation="overlay"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minWidth: "400px",
        width: "50vw",
        gap: 32,
        padding: 0,
        borderRadius: 4,
      }}
    >
      <Card.Header
        style={{
          padding: 0,
          borderBottom: "1px solid #DCDCDC",
        }}
      >
        <Card.HeaderTitle style={{ padding: "24px 40px" }}>
          <Typography variant="h2">Give your process a name</Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Card.Content
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          padding: 0,
        }}
      >
        <TextField
          autoFocus
          style={{ width: "60%", minWidth: 300, padding: "16px 40px" }}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onNameChange(e.target.value ?? "")
          }
          id="vsmObjectName"
          helperText="You can change the process name later."
          placeholder="Enter process name here"
        />
      </Card.Content>
      <Card.Actions
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #dcdcdc",
          padding: "24px 40px",
        }}
      >
        <Button variant="ghost" onClick={onRequestDiscard}>
          Discard
        </Button>
        <Button onClick={onNext} disabled={isNextDisabled}>
          Create
        </Button>
      </Card.Actions>
    </Card>
  );
}

type GiveAccessStageProps = {
  project: Project;
  processName: string;
  onBack: () => void;
  onNext: () => void;
  onRequestDiscard: () => void;
};

function GiveAccessStage({
  project,
  processName,
  onBack,
  onNext,
  onRequestDiscard,
}: GiveAccessStageProps) {
  return (
    <Card
      elevation="overlay"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "60vw",
        height: "80vh",
        gap: 20,
        padding: 0,
        borderRadius: 4,
      }}
    >
      <Card.Header
        style={{
          padding: 0,
          borderBottom: "1px solid #DCDCDC",
        }}
      >
        <Card.HeaderTitle style={{ padding: "24px 40px" }}>
          <Typography variant="h2">{processName}</Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Card.Content
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minHeight: 0,
          overflow: "hidden",
          padding: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: "0 40px",
          }}
        >
          <Typography
            variant="h4"
            style={{ display: "flex", alignItems: "center", gap: 16 }}
          >
            <Icon data={share} size={24} />
            Who needs writing access?
          </Typography>
          <Typography>You can add or remove access later.</Typography>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0 calc(40px - 16px)",
            overflow: "auto",
            minHeight: 0,
            flexGrow: 1,
          }}
        >
          <AddUserAccessSection project={project} isAdmin={true} />
        </div>
      </Card.Content>
      <Card.Actions
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #dcdcdc",
          padding: "24px 40px",
        }}
      >
        <Button variant="ghost" onClick={onRequestDiscard}>
          Discard
        </Button>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>Next</Button>
        </div>
      </Card.Actions>
    </Card>
  );
}

type AddLabelsStageProps = {
  project: Project;
  processName: string;
  onBack: () => void;
  onFinish: () => void;
  onRequestDiscard: () => void;
};

function AddLabelsStage({
  project,
  processName,
  onBack,
  onFinish,
  onRequestDiscard,
}: AddLabelsStageProps) {
  return (
    <Card
      elevation="overlay"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "max(60vw, 400px)",
        height: "80vh",
        gap: 20,
        padding: 0,
        borderRadius: 4,
      }}
    >
      <Card.Header
        style={{
          padding: 0,
          borderBottom: "1px solid #DCDCDC",
        }}
      >
        <Card.HeaderTitle style={{ padding: "24px 40px" }}>
          <Typography variant="h2">{processName}</Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Card.Content
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          padding: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: "0 40px",
          }}
        >
          <Typography
            variant="h4"
            style={{ display: "flex", alignItems: "center", gap: 16 }}
          >
            <Icon data={tag} size={24} />
            Add labels
          </Typography>
          <div>
            <Typography>
              Add labels to make it easier to find relevant processes.
            </Typography>
            <Typography>Labels can be added or changed later.</Typography>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            overflowY: "auto",
            padding: "16px 40px 0 40px",
          }}
        >
          <AddLabelsSection process={project} withHorizontalCategories />
        </div>
      </Card.Content>
      <Card.Actions
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #dcdcdc",
          padding: "24px 40px",
        }}
      >
        <Button variant="ghost" onClick={onRequestDiscard}>
          Discard
        </Button>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onFinish}>Complete</Button>
        </div>
      </Card.Actions>
    </Card>
  );
}

type MandatoryGuideProps = {
  onDiscard: () => void;
  updateProjectName: (name: string) => Promise<void>;
  project: Project;
};

export function MandatoryGuide({
  project,
  updateProjectName,
  onDiscard,
}: MandatoryGuideProps) {
  const threshold = new Date();
  threshold.setMinutes(threshold.getMinutes() - 1);

  // is created within the last minute and has default name or no name
  const isNew =
    Date.parse(project.created) > threshold.getTime() &&
    (!project.name?.trim() ||
      project.name.trim().toLowerCase() === "untitled process");

  const [newName, setNewName] = useState<string>();
  const [showInitialRenameScrim, setShowInitialRenameScrim] =
    useState<boolean>(isNew);
  const [mandatoryInfoStage, setMandatoryInfoStage] = useState<
    MandatoryInfoStage | undefined
  >("addName");
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);

  const moveToPreviousStage = () => {
    switch (mandatoryInfoStage) {
      case "giveAccesses":
        setMandatoryInfoStage("addName");
        break;
      case "addLabels":
        setMandatoryInfoStage("giveAccesses");
        break;
    }
  };

  const moveToNextStage = async () => {
    switch (mandatoryInfoStage) {
      case "addName":
        await updateProjectName(newName ?? "");
        setMandatoryInfoStage("giveAccesses");
        break;
      case "giveAccesses":
        setMandatoryInfoStage("addLabels");
        break;
      case "addLabels":
        setMandatoryInfoStage(undefined);
        setShowInitialRenameScrim(false);
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
          <Dialog.Title style={{ padding: "24px 24px" }}>
            <Typography variant="h2">Discard process?</Typography>
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.CustomContent style={{ padding: "0 40px", minHeight: 0 }}>
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
            width: "-webkit-fill-available",
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
        open={!showDiscardConfirmation && showInitialRenameScrim}
        onWheel={(e) => e.stopPropagation()}
      >
        {mandatoryInfoStage === "addName" && (
          <AddNameStage
            onNameChange={setNewName}
            onNext={moveToNextStage}
            onRequestDiscard={() => setShowDiscardConfirmation(true)}
            isNextDisabled={
              !newName || newName.toLowerCase() === "untitled process"
            }
          />
        )}
        {mandatoryInfoStage === "giveAccesses" && (
          <GiveAccessStage
            project={project}
            processName={project.name ?? "Untitled Process"}
            onBack={moveToPreviousStage}
            onNext={moveToNextStage}
            onRequestDiscard={() => setShowDiscardConfirmation(true)}
          />
        )}
        {mandatoryInfoStage === "addLabels" && (
          <AddLabelsStage
            project={project}
            processName={project.name ?? "Untitled Process"}
            onBack={moveToPreviousStage}
            onFinish={moveToNextStage}
            onRequestDiscard={() => setShowDiscardConfirmation(true)}
          />
        )}
      </Scrim>
    </>
  );
}
