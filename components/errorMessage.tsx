import React from "react";
import { Icon } from "@equinor/eds-core-react";
import { error_filled } from "@equinor/eds-icons";
import { unknownErrorToString } from "../utils/isError";

export function ErrorMessage(props: { error: unknown | object }) {
  if (!props.error) return null;
  const { error } = props;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <div>
        <Icon data={error_filled} size={48} />
      </div>
      <div>
        <p>{unknownErrorToString(error)}</p>
      </div>
    </div>
  );
}
