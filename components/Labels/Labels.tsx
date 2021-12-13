import { Chip, Icon, Button } from "@equinor/eds-core-react";
import { processLabel } from "interfaces/processLabel";
import React from "react";
import styles from "./Labels.module.scss";
import { edit } from "@equinor/eds-icons";
import { useRouter } from "next/router";
import { getUpdatedLabel } from "utils/getUpdatedLabel";

export default function Labels(props: {
  labels: processLabel[];
  onClickEdit: (x: boolean) => void;
  userCanEdit: boolean;
}): JSX.Element {
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
      {props.userCanEdit && (
        <Button
          style={{
            height: "24px",
            width: "24px",
            marginRight: "5px",
            marginBottom: "10px",
          }}
          color="primary"
          variant="ghost_icon"
          onClick={(e) => {
            e.stopPropagation();
            props.onClickEdit(true);
          }}
        >
          <Icon data={edit} />
        </Button>
      )}
      {labels.map((label) => (
        <Chip
          style={{ marginRight: "5px", marginBottom: "10px" }}
          key={label.id}
          onClick={(e) => {
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
