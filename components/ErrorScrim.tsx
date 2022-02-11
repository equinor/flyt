import { Button, Dialog, Scrim, Typography } from "@equinor/eds-core-react";

import React from "react";

export function ErrorScrim(props: {
  visible: boolean;
  handleClose: () => void;
  title?: string;
  messages: Array<string>;
}): JSX.Element {
  if (!props.visible) return null;
  return (
    <Scrim open onClose={props.handleClose}>
      <Dialog>
        <Dialog.Title>{props.title || "Error"}</Dialog.Title>
        <Dialog.CustomContent scrollable>
          {props.messages.map((message) => (
            <Typography variant="body_short" key={message}>
              {message}
            </Typography>
          ))}
        </Dialog.CustomContent>
        <Dialog.Actions>
          <div>
            <Button onClick={props.handleClose}>OK</Button>
          </div>
        </Dialog.Actions>
      </Dialog>
    </Scrim>
  );
}
