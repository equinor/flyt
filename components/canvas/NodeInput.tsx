import { TextField, TextFieldProps } from "@equinor/eds-core-react";
import { ChangeEvent, FocusEvent, useState } from "react";

export type NodeInputProps = Omit<TextFieldProps, "value"> & {
  initialValue?: string;
};

export const NodeInput = (props: NodeInputProps) => {
  const [value, setValue] = useState(props.initialValue || "");
  const handleOnBlur = (
    e: FocusEvent<HTMLTextAreaElement, Element> &
      FocusEvent<HTMLInputElement, Element>
  ) => {
    props.onBlur && props.onBlur(e);
  };
  return (
    <TextField
      {...(props as TextFieldProps)}
      value={value}
      onChange={(
        e: ChangeEvent<HTMLInputElement> & ChangeEvent<HTMLTextAreaElement>
      ) => {
        setValue(e.target.value);
      }}
      onBlur={handleOnBlur}
      style={{ backgroundColor: "transparent" }}
    />
  );
};
