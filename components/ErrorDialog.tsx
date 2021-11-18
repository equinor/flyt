import { Button, Scrim } from "@equinor/eds-core-react";
import React from "react";
import { unknownErrorToString } from "utils/isError";

export function ErrorDialog({
  visible,
  error,
  onClose,
}: {
  visible: boolean;
  error: unknown;
  onClose: () => void;
}): JSX.Element {
  if (!error || !visible) return null;

  return (
    error && (
      <Scrim isDismissable onClose={onClose}>
        <div
          style={{
            backgroundColor: "white",
            padding: "1rem",
            borderRadius: 4,
            maxWidth: "30rem",
            maxHeight: "30rem",
          }}
        >
          <h3>Error</h3>
          <p>{unknownErrorToString(error)}</p>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </div>
      </Scrim>
    )
  );
}
