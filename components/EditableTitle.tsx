import React from "react";
import styles from "layouts/default.layout.module.scss";
import { TextField } from "@equinor/eds-core-react";

export const EditableTitle = (props: {
  defaulText?: string;
  readOnly?: boolean;
  onSubmit: (arg0: string) => void;
}) => {
  const { defaulText, readOnly, onSubmit } = props;
  const text = defaulText || "Untitled process";

  const handleSubmit = (e) => {
    if (e.code === "Enter" || e.type === "blur") {
      e.target.value !== text && onSubmit(e.target.value);
    }
    e.code === "Enter" && e.target.blur();
  };

  return (
    <TextField
      id={"title"}
      key={text}
      defaultValue={text}
      readOnly={readOnly}
      className={styles.projectName}
      onBlur={(e) => {
        handleSubmit(e);
      }}
      onKeyDown={(e) => {
        handleSubmit(e);
      }}
    />
  );
};
