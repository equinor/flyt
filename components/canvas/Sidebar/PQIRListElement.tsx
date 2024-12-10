import MarkdownEditor from "@/components/MarkdownEditor";
import { useStoreDispatch } from "@/hooks/storeHooks";
import { NodeDataCommon } from "@/types/NodeData";
import { Task } from "@/types/Task";
import {
  Accordion,
  Button,
  Checkbox,
  Icon,
  Typography,
} from "@equinor/eds-core-react";
import { add, delete_to_trash, minimize } from "@equinor/eds-icons";
import { TextCircle } from "../entities/TextCircle";
import styles from "./PQIRListElement.module.scss";
import { PQIRTypeSelection } from "./PQIRTypeSelection";
import { usePQIR } from "./usePQIR";
import { usePQIRMutations } from "./usePQIRMutations";

type PQIRListElement = {
  pqir: Task;
  isSelectedSection?: boolean;
  selectedNode: NodeDataCommon;
  userCanEdit: boolean;
};

export const PQIRListELement = ({
  pqir,
  isSelectedSection,
  selectedNode,
  userCanEdit,
}: PQIRListElement) => {
  const {
    description,
    setDescription,
    selectedType,
    setSelectedType,
    solved,
    setSolved,
    color,
    shorthand,
    hasChanges,
  } = usePQIR(pqir, selectedNode);
  const { linkPQIR, unlinkPQIR, updatePQIR } = usePQIRMutations();
  const dispatch = useStoreDispatch();
  const selectedNodeId = selectedNode.id;
  const pqirId = pqir.id;

  const selectOrDeselectButton = (
    <Button
      variant="ghost_icon"
      onClick={(e) => {
        e.stopPropagation();
        isSelectedSection
          ? unlinkPQIR.mutate({ selectedNodeId, pqirId })
          : linkPQIR.mutate({ selectedNodeId, pqirId });
      }}
      title={isSelectedSection ? "Remove PQIR from card" : "Add PQIR to card"}
    >
      <Icon data={isSelectedSection ? minimize : add} />
    </Button>
  );

  const panelSectionTop = (
    <div className={styles["panel-top"]}>
      <PQIRTypeSelection
        selectedType={selectedType}
        onClick={(type) => setSelectedType(type)}
      />
      <div>
        {solved !== null && isSelectedSection && (
          <Checkbox
            checked={solved}
            onChange={(e) => setSolved(e.target.checked)}
            title="Mark as solved"
          />
        )}
        <Button
          variant="ghost_icon"
          onClick={() => dispatch.setPQIRToBeDeletedId(pqir.id)}
          title="Delete PQIR"
        >
          <Icon data={delete_to_trash} />
        </Button>
      </div>
    </div>
  );

  const panelSectionBottom = (
    <div className={styles.actionButtonsContainer}>
      <Button
        onClick={() =>
          updatePQIR?.mutate({
            pqir: {
              ...pqir,
              description: description,
              type: selectedType,
              solved: solved,
            },
            selectedNodeId,
          })
        }
        className={styles.actionButton}
        disabled={!hasChanges || !description}
      >
        Save
      </Button>
    </div>
  );

  return (
    <Accordion.Item chevronPosition="left" key={pqir.id}>
      <Accordion.Header
        className={styles.accordionHeader}
        style={{ borderRadius: "5px" }}
      >
        <TextCircle text={shorthand} color={color} />
        <Typography className={styles.pqirDescription}>
          {pqir.description}
        </Typography>
        {userCanEdit ? selectOrDeselectButton : ""}
      </Accordion.Header>
      <Accordion.Panel className={styles.panel}>
        <div className={styles.panelContent}>
          {userCanEdit && panelSectionTop}
          <MarkdownEditor
            defaultText={description}
            onChange={(value) => value && setDescription(value)}
            canEdit={userCanEdit}
            requireText
          />
          {userCanEdit && panelSectionBottom}
        </div>
      </Accordion.Panel>
    </Accordion.Item>
  );
};
