import { TextField, TextFieldProps } from "@equinor/eds-core-react";
import { ChangeEvent } from "react";

type PQIRListElementTextFieldProps = TextFieldProps & {
  id: string;
  userCanEdit: boolean;
  onEdit: (e: string) => void;
};

export const PQIRListElementTextField = ({
  id,
  value,
  onEdit,
  userCanEdit,
}: PQIRListElementTextFieldProps) => (
  <TextField
    id={id}
    value={value}
    onChange={(e: ChangeEvent<HTMLInputElement>) => onEdit(e.target.value)}
    multiline
    rows={5}
    style={{ backgroundColor: "none" }}
    readOnly={!userCanEdit}
    variant={!value ? "error" : undefined}
    helperText={!value ? "Description is required" : ""}
    maxLength={4000}
  />
);
