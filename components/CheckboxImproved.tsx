import { Checkbox } from "@equinor/eds-core-react";
import React from "react";

/**
 * EDS checkbox with proper spacing between checkbox and label
 * @param props
 * @constructor
 */
export function CheckboxImproved(props: {
  setIsChecked: (isChecked: (p) => boolean) => void;
  isChecked: boolean;
  label: string;
}): JSX.Element {
  return (
    <div
      style={{ paddingRight: 20, display: "flex", cursor: "pointer" }}
      onClick={() => props.setIsChecked((p) => !p)}
    >
      <Checkbox checked={props.isChecked} onChange={() => null} />
      <p>{props.label}</p>
    </div>
  );
}
