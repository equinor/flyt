import { Chip } from "@equinor/eds-core-react";
import { processLabel } from "interfaces/processLabel";
import React from "react";
import styles from "./Labels.module.scss";

export default function Labels(props: {
  labels: processLabel[];
  onLabelClick: (x: boolean) => void;
}): JSX.Element {
  const { labels } = props;

  return (
    <div className={styles.container}>
      {labels.map((label) => (
        <Chip
          key={label.id}
          style={{ marginRight: "5px", marginBottom: "10px" }}
          onClick={(e) => {
            e.stopPropagation();
            props.onLabelClick(true);
          }}
        >
          {label.text}
        </Chip>
      ))}
    </div>
  );
}
