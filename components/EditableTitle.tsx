import React, { useState } from "react";
import styles from "../layouts/default.layout.module.scss";

export const EditableTitle = (props) => {
  const { defaultValue, readOnly, onConfirm } = props;
  const [projectTitle, setProjectTitle] = useState(defaultValue);
  let confirmed = false;

  const handleTitleChange = (e) => {
    confirmed = false;
    if (e.code === "Enter") {
      confirmed = true;
      onConfirm(projectTitle);
      e.preventDefault();
      e.target.blur();
    }
  };

  return (
    <input
      value={projectTitle}
      readOnly={readOnly}
      className={styles.projectName}
      style={{ width: projectTitle.length + "ch" }}
      onKeyDown={(e) => handleTitleChange(e)}
      onInput={(e) => setProjectTitle((e.target as HTMLInputElement).value)}
      onBlur={() => !confirmed && setProjectTitle(defaultValue)}
    />
  );
};
