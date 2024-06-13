import { TextField } from "@equinor/eds-core-react";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import styles from "./EditableTitle.module.scss";

export const EditableTitle = (props: {
  defaultText: string;
  readOnly?: boolean;
  onSubmit: (arg0: string) => void;
}) => {
  const { defaultText, readOnly, onSubmit } = props;
  const [text, setText] = useState(defaultText);

  useEffect(() => {
    setText(defaultText);
  }, [defaultText]);

  const handleOnEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <TextField
      id={"title"}
      value={text}
      readOnly={readOnly}
      className={styles.title}
      onBlur={() => {
        onSubmit(text);
      }}
      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
        handleOnEnter(e);
      }}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
      }}
      multiline={false}
      style={{ width: text.length + 2 + "ch" }}
    />
  );
};
