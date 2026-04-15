import { TextField, TextFieldProps } from "@equinor/eds-core-react";
import { ChangeEvent, FocusEvent, useEffect, useState } from "react";

export type NodeInputProps = Omit<TextFieldProps, "value"> & {
  initialValue?: string;
  lastUpdatedValue?: string;
};

export const NodeInput = (props: NodeInputProps) => {
  const [value, setValue] = useState(props.initialValue || "");

  useEffect(() => {
    if (props.lastUpdatedValue !== props.initialValue)
      setValue(props.initialValue || "");
  }, [props.initialValue]);

  return (
    <TextField
      {...(props as TextFieldProps)}
      value={value}
      onChange={(
        e: ChangeEvent<HTMLInputElement> & ChangeEvent<HTMLTextAreaElement>
      ) => {
        props.onChange && props.onChange(e);
        setValue(e.target.value);
      }}
      style={{ backgroundColor: "transparent" }}
    />
  );
};
