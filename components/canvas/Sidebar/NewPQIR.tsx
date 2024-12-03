import { NodeDataCommon } from "@/types/NodeData";
import { uid } from "@/utils/uuid";
import { Button, Checkbox, Icon } from "@equinor/eds-core-react";
import { add } from "@equinor/eds-icons";
import styles from "./PQIRListElement.module.scss";
import { PQIRListElementTextField } from "./PQIRListElementTextField";
import { PQIRTypeSelection } from "./PQIRTypeSelection";
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
        disabled={!description}
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
        <PQIRListElementTextField
          id={uid()}
          value={description}
          onEdit={(e) => setDescription(e)}
          userCanEdit
        />
        {panelSectionBottom()}
      </div>
    </div>
  );
};
