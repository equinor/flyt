// components/MandatoryInfoWizard/AddLabelsStage.tsx

import { Button, Card, Icon, Typography } from "@equinor/eds-core-react";
import { tag } from "@equinor/eds-icons";

import { AddLabelsSection } from "@/components/Labels/ManageLabelBox";
import { AddLabelsStageProps } from "./types";
export function AddLabelsStage({
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
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

          <Button onClick={onFinish}>Finish</Button>
        </div>
      </Card.Actions>
    </Card>
  );
}
