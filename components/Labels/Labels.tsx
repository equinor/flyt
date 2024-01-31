import { Chip } from "@equinor/eds-core-react";
import { processLabel } from "interfaces/processLabel";
import React from "react";
import styles from "./Labels.module.scss";
import { useRouter } from "next/router";
import { getUpdatedLabel } from "utils/getUpdatedLabel";

export default function Labels(props: { labels: processLabel[] }): JSX.Element {
  const { labels } = props;
  const router = useRouter();

  // rl stands for "required label"
  const handleClickLabel = (selectedLabelId: string) => {
    const labelIdArray = getUpdatedLabel(selectedLabelId, router.query.rl);
    router.replace({
      query: { ...router.query, rl: labelIdArray },
    });
  };

  return (
    <div className={styles.container}>
      {labels.map((label) => (
        <Chip
          style={{ marginRight: "5px", marginBottom: "10px" }}
          key={label.id}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClickLabel(label.id.toString());
          }}
        >
          {label.text}
        </Chip>
      ))}
    </div>
  );
}
