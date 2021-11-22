import React from "react";
import { getLabels } from "services/labelsApi";
import { useQuery } from "react-query";
import { unknownErrorToString } from "utils/isError";
import styles from "./ListExistingLabels.module.scss";
import { Button } from "@equinor/eds-core-react";
import { processLabel } from "interfaces/processLabel";

export default function ListExistingLabels(props: {
  searchText: string;
  addLabel: (label: processLabel) => void;
}): JSX.Element {
  const { data: labels, error } = useQuery(["labels", props.searchText], () =>
    getLabels(props.searchText)
  );

  return (
    <div className={styles.container}>
      {error && <p>{unknownErrorToString(error)}</p>}

      {labels?.map((label) => (
        <Button
          key={label.id}
          className={styles.buttonExistingLabel}
          color="primary"
          variant="ghost"
          onClick={() => {
            props.addLabel(label);
          }}
        >
          {label.text}
        </Button>
      ))}
    </div>
  );
}
