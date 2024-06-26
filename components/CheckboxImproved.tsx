import { Checkbox } from "@equinor/eds-core-react";

/**
 * EDS checkbox with proper spacing between checkbox and label
 * @param props
 * @constructor
 */
export function CheckboxImproved(props: {
  setIsChecked: (isChecked: (p: boolean) => boolean) => void;
  isChecked: boolean;
  label: string;
}) {
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
