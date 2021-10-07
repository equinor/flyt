import { Chip } from "@equinor/eds-core-react";
import React from "react";
import styles from "./LabelContainer.module.scss";

export default function LabelContainer(props: {
  labels: string[];
}): JSX.Element {
  const { labels } = props;
  return (
    <div className={styles.container}>
      {labels.map((label) => (
        <Chip key={label}>{label}</Chip>
      ))}
    </div>
  );
}
