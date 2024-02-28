import { Button, Dialog, Typography } from "@equinor/eds-core-react";

export function ErrorScrim(props: {
  visible: boolean;
  handleClose: () => void;
  title?: string;
  messages?: string[];
}): JSX.Element {
  return (
    <Dialog open={props.visible} onClose={props.handleClose}>
      <Dialog.Title>{props.title || "Error"}</Dialog.Title>
      <Dialog.CustomContent scrollable>
        {props.messages?.map((message) => (
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
  );
}
