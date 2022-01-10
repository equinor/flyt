import { Button, Chip, Icon, Scrim, Search } from "@equinor/eds-core-react";
import React, { useEffect, useState } from "react";
import {
  addLabelToProcess,
  getLabels,
  removeLabelFromProcess,
} from "services/labelsApi";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { close } from "@equinor/eds-icons";
import { debounce } from "utils/debounce";
import { processLabel } from "interfaces/processLabel";
import styles from "./ManageLabelBox.module.scss";
import { unknownErrorToString } from "utils/isError";
import { vsmProject } from "interfaces/VsmProject";

export default function ManageLabelBox(props: {
  isVisible: boolean;
  handleClose: () => void;
  process: vsmProject;
}): JSX.Element {
  if (!props.isVisible) return null;

  return (
    <Scrim onClose={props.handleClose} isDismissable>
      <div className={styles.box} onWheel={(e) => e.stopPropagation()}>
        <TopSection handleClose={props.handleClose} />
        <AddSection process={props.process} />
      </div>
    </Scrim>
  );
}

function TopSection(props: { handleClose: () => void }): JSX.Element {
  return (
    <div className={styles.topSection}>
      <p className={styles.heading}>Add labels</p>
      <Button variant={"ghost_icon"} onClick={props.handleClose}>
        <Icon data={close} />
      </Button>
    </div>
  );
}

function AddSection(props: { process: vsmProject }): JSX.Element {
  const [term, setTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: labels, error } = useQuery(["labels", debouncedTerm], () =>
    getLabels(debouncedTerm)
  );

  const handleChange = (event) => {
    setTerm(event.target.value);
  };

  useEffect(() => {
    debounce(
      () => {
        setDebouncedTerm(term);
      },
      200,
      "LabelSearchQuery"
    );
  }, [term]);

  const addLabelMutation = useMutation(
    (payload: {
      processID: number;
      label: processLabel | { text: string };
    }) => {
      return addLabelToProcess(payload.processID, payload.label);
    },
    { onSettled: () => queryClient.invalidateQueries() }
  );

  const handleSelect = (item: string) => {
    const trimmedItem = item.trim();
    if (!trimmedItem) {
      return null;
    }
    addLabelMutation.mutate({
      processID: props.process.vsmProjectID,
      label: { text: trimmedItem },
    });
    setTerm("");
  };

  const removeLabelMutation = useMutation(
    (payload: { processID: number; labelID: number }) =>
      removeLabelFromProcess(payload.processID, payload.labelID),
    {
      onSettled: () => queryClient.invalidateQueries(),
    }
  );

  const handleDelete = (item: number) => {
    removeLabelMutation.mutate({
      processID: props.process.vsmProjectID,
      labelID: item,
    });
  };

  return (
    <>
      <Search
        aria-label="search"
        id="searchProjects"
        placeholder="Search labels"
        autoComplete="off"
        className={styles.searchField}
        onChange={handleChange}
        autoFocus
        value={term}
      />
      {error && <p>{unknownErrorToString(error)}</p>}
      <div className={styles.labelSection}>
        {props.process.labels?.map((label) => (
          <Chip
            key={label.id}
            onDelete={() => handleDelete(label.id)}
            style={{
              marginRight: "10px",
              marginBottom: "10px",
            }}
            variant="active"
          >
            {label.text}
          </Chip>
        ))}

        {labels?.map(function (label) {
          if (
            !props.process.labels.some(
              (existingLabel) => existingLabel.text == label.text
            )
          ) {
            return (
              <Chip
                key={label.id}
                onClick={() => handleSelect(label.text)}
                style={{
                  marginRight: "10px",
                  marginBottom: "10px",
                }}
              >
                {label.text}
              </Chip>
            );
          }
        })}
      </div>
    </>
  );
}
