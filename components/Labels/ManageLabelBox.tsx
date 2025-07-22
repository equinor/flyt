import { Button, Chip, Icon, Scrim, Search } from "@equinor/eds-core-react";
import { ChangeEvent, useEffect, useState } from "react";
import {
  addLabelToProcess,
  getLabels,
  removeLabelFromProcess,
} from "services/labelsApi";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { close } from "@equinor/eds-icons";
import { debounce } from "utils/debounce";
import { ProcessLabel } from "@/types/ProcessLabel";
import styles from "./ManageLabelBox.module.scss";
import { unknownErrorToString } from "utils/isError";
import { Project } from "types/Project";
import { getCategorizedLabels } from "@/utils/getCategorizedLabels";
import LabelCategory from "./LabelCategory";

export function ManageLabelBox(props: {
  isVisible: boolean;
  handleClose: () => void;
  process: Project;
}) {
  if (!props.isVisible) return null;

  return (
    <Scrim open onClose={props.handleClose} isDismissable>
      <div className={styles.box} onWheel={(e) => e.stopPropagation()}>
        <TopSection handleClose={props.handleClose} />
        <AddSection process={props.process} />
      </div>
    </Scrim>
  );
}

function TopSection(props: { handleClose: () => void }) {
  return (
    <div className={styles.topSection}>
      <p className={styles.heading}>Add labels</p>
      <Button variant={"ghost_icon"} onClick={props.handleClose}>
        <Icon data={close} />
      </Button>
    </div>
  );
}

function AddSection(props: { process: Project }) {
  const [term, setTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: labels, error } = useQuery(["labels", debouncedTerm], () =>
    getLabels(debouncedTerm)
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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
      label: ProcessLabel | { text: string };
    }) => {
      return addLabelToProcess(payload.processID, payload.label);
    },
    { onSettled: () => queryClient.invalidateQueries() }
  );

  const handleSelect = (item: ProcessLabel) => {
    const trimmedItem = item.text.trim();
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

  const handleDelete = (item: ProcessLabel) => {
    removeLabelMutation.mutate({
      processID: props.process.vsmProjectID,
      labelID: item.id,
    });
  };

  const isActive = (id: string) => {
    if (props.process.labels) {
      return props.process.labels.some(
        (element) => element.id.toString() == id
      );
    }
  };

  const handleLabels = (label: any, isAdd: boolean) => {
    if (isAdd) handleSelect(label);
    else handleDelete(label);
  };
  const [categorisedLabels] = getCategorizedLabels(labels || []);

  return (
    <>
      <Search
        aria-label="search"
        placeholder="Search labels"
        autoComplete="off"
        onChange={handleChange}
        autoFocus
        value={term}
      />
      {error && <p>{unknownErrorToString(error)}</p>}
      <div className={styles.labelContainer}>
        {categorisedLabels &&
          Object.keys(categorisedLabels).map((categoryName) => {
            return (
              <LabelCategory
                key={categoryName}
                categoryName={categoryName}
                labels={categorisedLabels[categoryName]}
                isActive={isActive}
                handleLabels={handleLabels}
              />
            );
          })}
      </div>
    </>
  );
}
