import { Chip } from "@equinor/eds-core-react";
import { processLabel } from "interfaces/processLabel";
import React from "react";
import styles from "./Labels.module.scss";

export default function Labels(props: { labels: processLabel[] }): JSX.Element {
  const { labels } = props;

  return (
    <div className={styles.container}>
      {labels.map((label) => (
        <Chip key={label.id}>{label.text}</Chip>
      ))}
    </div>
  );
}
