import { Chip, Typography } from "@equinor/eds-core-react";
import React from "react";
import styles from "./LabelCategory.module.scss";
import { ProcessLabel } from "@/types/ProcessLabel";

const chipInlineStyle: React.CSSProperties = {
  marginRight: "5px",
  marginBottom: "10px",
  height: "auto",
  gridTemplateColumns: "auto",
  whiteSpace: "normal",
  wordBreak: "break-word",
};

export default function LabelCategory(props: {
  categoryName: string;
  labels: ProcessLabel[];
  isActive: (id: string) => boolean | undefined;
  handleLabels: (id: string, isSelect: boolean) => void;
}) {
  const { categoryName, labels, isActive, handleLabels } = props;

  return (
    <div className={styles.categoryContainer}>
      <Typography className={styles.categoryTitle}>{categoryName}</Typography>
      <div className={styles.labelsContainer}>
        {labels.map((label: any) => {
          const isLabelActive = isActive(label.id.toString());
          return (
            <Chip
              key={label.id}
              variant={isLabelActive ? "active" : undefined}
              style={chipInlineStyle}
              onClick={() => handleLabels(label, true)}
              onDelete={
                isLabelActive ? () => handleLabels(label, false) : undefined
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
