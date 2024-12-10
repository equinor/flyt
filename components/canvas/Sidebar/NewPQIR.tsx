import MarkdownEditor from "@/components/MarkdownEditor";
import { NodeDataCommon } from "@/types/NodeData";
import { Button, Checkbox, Icon } from "@equinor/eds-core-react";
import { add } from "@equinor/eds-icons";
import styles from "./PQIRListElement.module.scss";
import { PQIRTypeSelection } from "./PQIRTypeSelection";
import { usePQIR } from "./usePQIR";
import { usePQIRMutations } from "./usePQIRMutations";

type NewPQIRProps = {
  selectedNode: NodeDataCommon;
};

export const NewPQIR = ({ selectedNode }: NewPQIRProps) => {
  const {
    description,
    setDescription,
    selectedType,
    setSelectedType,
    solved,
    setSolved,
    isEditing,
    setIsEditing,
  } = usePQIR(null, selectedNode);
  const { createPQIR } = usePQIRMutations();

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
          title="Mark as solved"
        />
      )}
    </div>
  );

  const panelSectionBottom = (selectedNodeId: string) => (
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
        onClick={() =>
          createPQIR.mutate(
            {
              description,
              selectedType,
              solved,
              selectedNodeId,
            },
            {
              onSuccess() {
                setIsEditing(false);
              },
            }
          )
        }
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
        <MarkdownEditor
          defaultText={description}
          onChange={(value) => value && setDescription(value)}
          canEdit
          requireText
        />
        {panelSectionBottom(selectedNode.id)}
      </div>
    </div>
  );
};
