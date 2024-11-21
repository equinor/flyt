import { Button, Checkbox, Icon, TextField } from "@equinor/eds-core-react";
import { add } from "@equinor/eds-icons";
import { ChangeEvent } from "react";
import styles from "./PQIRListElement.module.scss";
import { PQIRTypeSelection } from "./PQIRTypeSelection";
import { uid } from "@/utils/uuid";
import { NodeDataCommon } from "@/types/NodeData";
import { usePQIR } from "./usePQIR";

type NewPQIRProps = {
  selectedNode: NodeDataCommon;
};

export const NewPQIR = ({ selectedNode }: NewPQIRProps) => {
  const {
    createPQIR,
    description,
    setDescription,
    selectedType,
    setSelectedType,
    solved,
    setSolved,
    isEditing,
    setIsEditing,
  } = usePQIR(null, selectedNode);

  const panelSectionTop = () => (
    <div className={styles["panel-top"]}>
      <PQIRTypeSelection
        selectedType={selectedType}
        onClick={(type) => setSelectedType(type)}
      />
      {solved !== null && (
        <Checkbox
          defaultChecked={solved}
          onChange={(e) => setSolved(e.target.checked)}
        />
      )}
    </div>
  );

  const panelSectionMiddle = () => (
    <TextField
      id={uid()}
      value={description}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        setDescription(e.target.value)
      }
      multiline
      rows={5}
      className={styles.textInput}
    />
  );

  const panelSectionBottom = () => (
    <div className={styles.actionButtonsContainer}>
      <Button
        variant="outlined"
        className={styles.actionButton}
        onClick={() => setIsEditing(false)}
      >
        Cancel
      </Button>
      <Button
        className={styles.actionButton}
        onClick={() => createPQIR.mutate()}
      >
        Create
      </Button>
    </div>
  );

  return !isEditing ? (
    <Button
      variant="outlined"
      onClick={() => setIsEditing(true)}
      className={styles.createPQIRButton}
    >
      <Icon data={add} />
      Create new PQIR
    </Button>
  ) : (
    <div className={styles.panel}>
      <div className={styles.panelContent}>
        {panelSectionTop()}
        {panelSectionMiddle()}
        {panelSectionBottom()}
      </div>
    </div>
  );
};
