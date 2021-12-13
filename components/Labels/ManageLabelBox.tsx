import React, { useEffect, useRef, useState } from "react";
import { Button, Chip, Icon, Input, Scrim } from "@equinor/eds-core-react";
import styles from "./ManageLabelBox.module.scss";
import { close } from "@equinor/eds-icons";
import { addLabelToProcess, removeLabelFromProcess } from "services/labelsApi";
import { useMutation, useQueryClient } from "react-query";
import { vsmProject } from "interfaces/VsmProject";
import { processLabel } from "interfaces/processLabel";
import AddLabelInput from "./AddLabelInput";

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
        <LabelSection process={props.process} />
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
  const queryClient = useQueryClient();

  const addLabelMutation = useMutation(
    (payload: {
      processID: number;
      label: processLabel | { text: string };
    }) => {
      return addLabelToProcess(payload.processID, payload.label);
    },
    { onSettled: () => queryClient.invalidateQueries() }
  );

  const addLabel = (label: processLabel | { text: string }) => {
    addLabelMutation.mutate({
      processID: props.process.vsmProjectID,
      label,
    });
  };

  const handleSelectTerm = (term: string) => {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) {
      return null;
    }
    addLabel({ text: trimmedTerm });
  };

  return (
    <>
      <AddLabelInput handleSelectTerm={handleSelectTerm} />
    </>
  );
}

function LabelSection(props: { process: vsmProject }): JSX.Element {
  const queryClient = useQueryClient();
  const removeLabelMutation = useMutation(
    (payload: { processID: number; labelID: number }) =>
      removeLabelFromProcess(payload.processID, payload.labelID),
    {
      onSettled: () => queryClient.invalidateQueries(),
    }
  );

  return (
    <div className={styles.labelSection}>
      {props.process.labels.map((label) => (
        <Chip
          key={label.id}
          onDelete={() =>
            removeLabelMutation.mutate({
              processID: props.process.vsmProjectID,
              labelID: label.id,
            })
          }
          style={{
            marginRight: "10px",
            marginBottom: "10px",
          }}
        >
          {label.text}
        </Chip>
      ))}
    </div>
  );
}
