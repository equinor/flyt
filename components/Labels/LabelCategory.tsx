import { Chip, Paper, Typography } from "@equinor/eds-core-react";
import React from "react";
import styles from "./LabelCategory.module.scss";

export default function LabelCategory(props: {
  labels: any;
  isActive: (id: string) => boolean | undefined;
  handleLabels: (id: string, isSelect: boolean) => void;
}) {
  const { labels, isActive, handleLabels } = props;

  return (
    <div className={styles.categoryContainer}>
      <Typography className={styles.categoryTitle}>
        L1 level Organisations
      </Typography>
      <div className={styles.labelsContainer}>
        {labels.map((label: any) => {
          const isLabelActive = isActive(label.id.toString());
          return (
            <Chip
              key={label.id}
              variant={isLabelActive ? "active" : undefined}
              style={{ marginRight: "5px", marginBottom: "10px" }}
              onClick={() => handleLabels(label.id.toString(), true)}
              onDelete={
                isLabelActive
                  ? () => handleLabels(label.id.toString(), false)
                  : undefined
              }
            >
              {label.text}
            </Chip>
          );
        })}
      </div>
    </div>
  );
}
