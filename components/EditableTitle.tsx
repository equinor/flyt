import React, { useEffect, useState } from "react";
import styles from "../layouts/default.layout.module.scss";

export const EditableTitle = (props) => {
  const { defaultValue, readOnly, onConfirm } = props;
  const [projectTitle, setProjectTitle] = useState(defaultValue);

  const handleConfirm = (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      e.target.blur();
    }
  };

  useEffect(() => {
    setProjectTitle(defaultValue);
  }, [defaultValue]);

  return (
    <input
      value={projectTitle}
      readOnly={readOnly}
      className={styles.projectName}
      style={{ width: projectTitle.length + "ch" }}
      onInput={(e) => setProjectTitle((e.target as HTMLInputElement).value)}
      onKeyDown={(e) => handleConfirm(e)}
      onBlur={() => onConfirm(projectTitle)}
    />
  );
};
