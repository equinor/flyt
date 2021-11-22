import React, { useEffect, useRef, useState } from "react";
import { Button, Chip, Icon, Input, Scrim } from "@equinor/eds-core-react";
import styles from "./ManageLabelBox.module.scss";
import { close } from "@equinor/eds-icons";
import { addLabelToProcess, removeLabelFromProcess } from "services/labelsApi";
import { useMutation, useQueryClient } from "react-query";
import { vsmProject } from "interfaces/VsmProject";
import { processLabel } from "interfaces/processLabel";
import ListExistingLabels from "./ListExistingLabels";
import { debounce } from "utils/debounce";
import { useOutsideClick } from "rooks";

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
  const [inputLabelText, setInputLabelText] = useState("");

  const queryClient = useQueryClient();
  const dropdownRef = useRef();
  useOutsideClick(dropdownRef, () => setInputLabelText(""));

  const [debouncedInputLabelText, setDebouncedInputLabelText] = useState("");
  useEffect(() => {
    debounce(
      () => {
        setDebouncedInputLabelText(inputLabelText);
      },
      200,
      "LabelSearchQuery"
    );
  }, [inputLabelText]);

  useEffect(() => {
    console.log(inputLabelText);
  }, [inputLabelText]);

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
    setInputLabelText("");
  };

  const handleAddClick = () => {
    if (!inputLabelText) {
      return null;
    }
    const index = props.process.labels
      .map((label) => label.text)
      .findIndex((element) => element == inputLabelText);
    if (index == -1) {
      addLabel({ text: inputLabelText });
    } else {
      addLabel({ id: props.process.labels[index].id, text: inputLabelText });
    }
  };

  return (
    <div className={styles.addSection}>
      <div
        ref={dropdownRef}
        style={{
          display: "flex",
          flexDirection: "column",
          flex: "60% 1 1",
          position: "relative",
        }}
      >
        <Input
          placeholder="Add process labels"
          onChange={(e) => {
            setInputLabelText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              handleAddClick();
            }
          }}
          value={inputLabelText}
        />

        {debouncedInputLabelText.length > 0 && (
          <div className={styles.containerListExistingLabels}>
            <ListExistingLabels
              searchText={debouncedInputLabelText}
              addLabel={addLabel}
            />
          </div>
        )}
      </div>
      <Button
        color="primary"
        variant="contained"
        style={{ marginLeft: "20px" }}
        onClick={handleAddClick}
      >
        Add
      </Button>
    </div>
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
        >
          {label.text}
        </Chip>
      ))}
    </div>
  );
}
