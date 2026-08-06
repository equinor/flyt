import { Button, Card, TextField, Typography } from "@equinor/eds-core-react";
import { ChangeEvent } from "react";
import { AddNameStageProps } from "./types";
export function AddNameStage({
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
          id="vsmObjectName"
          autoFocus
          style={{
            width: "60%",
            minWidth: 300,
            padding: "16px 40px",
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onNameChange(e.target.value ?? "")
          }
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
          Next
        </Button>
      </Card.Actions>
    </Card>
  );
}
