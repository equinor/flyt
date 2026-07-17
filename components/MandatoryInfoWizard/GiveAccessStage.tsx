import { Button, Card, Icon, Typography } from "@equinor/eds-core-react";
import { share } from "@equinor/eds-icons";

import { AddUserAccessSection } from "@/components/AccessBox";
import { GiveAccessStageProps } from "./types";

export function GiveAccessStage({
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
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
          <AddUserAccessSection project={project} isAdmin />
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
