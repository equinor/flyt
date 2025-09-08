import { NodeDataCommon } from "@/types/NodeData";
import {
  Button,
  Checkbox,
  Icon,
  Tooltip,
  Typography,
} from "@equinor/eds-core-react";
import { add } from "@equinor/eds-icons";
import dynamic from "next/dynamic";
import styles from "./PQIRListElement.module.scss";
import { PQIRTypeSelection } from "./PQIRTypeSelection";
import { usePQIR } from "./usePQIR";
import { usePQIRMutations } from "./usePQIRMutations";

const MarkdownEditor = dynamic(() => import("components/MarkdownEditor"), {
  ssr: false,
});

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
    </div>
  );

  const panelSectionBottom = (selectedNodeId: string) => (
    <div className={styles.actionButtonsContainer}>
      <div>
        {solved !== null && (
          <div className={styles.actioncontainer}>
            <Tooltip title="Mark PQIR as solved" placement="top">
              <Checkbox
                defaultChecked={solved}
                onChange={(e) => setSolved(e.target.checked)}
                className={styles.checkBoxStyle}
              />
            </Tooltip>
            <Typography className={styles.actionText}>Solved</Typography>
          </div>
        )}
      </div>
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
