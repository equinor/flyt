import { useStoreDispatch } from "@/hooks/storeHooks";
import { NodeDataCommon } from "@/types/NodeData";
import { Task } from "@/types/Task";
import {
  Accordion,
  Button,
  Checkbox,
  Icon,
  TextField,
  Typography,
} from "@equinor/eds-core-react";
import { add, delete_to_trash, minimize } from "@equinor/eds-icons";
import { ChangeEvent } from "react";
import { TextCircle } from "../entities/TextCircle";
import styles from "./PQIRListElement.module.scss";
import { PQIRListElementTextField } from "./PQIRListElementTextField";
import { PQIRTypeSelection } from "./PQIRTypeSelection";
import { usePQIR } from "./usePQIR";

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
    linkPQIR,
    unlinkPQIR,
    updatePQIR,
    description,
    setDescription,
    selectedType,
    setSelectedType,
    solved,
    setSolved,
    color,
    shorthand,
    isEditing,
    setIsEditing,
    hasChanges,
  } = usePQIR(pqir, selectedNode);
  const dispatch = useStoreDispatch();

  const selectOrDeselectButton = (
    <Button
      variant="ghost_icon"
      onClick={(e) => {
        e.stopPropagation();
        isSelectedSection ? unlinkPQIR?.mutate() : linkPQIR?.mutate();
      }}
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
          />
        )}
        <Button
          variant="ghost_icon"
          onClick={() => dispatch.setPQIRToBeDeletedId(pqir.id)}
        >
          <Icon data={delete_to_trash} />
        </Button>
      </div>
    </div>
  );

  const panelSectionBottom = (
    <div className={styles.actionButtonsContainer}>
      <Button
        onClick={() => updatePQIR?.mutate()}
        className={styles.actionButton}
        disabled={!hasChanges || !description}
      >
        Save
      </Button>
    </div>
  );

  return (
    <Accordion.Item
      chevronPosition="left"
      key={pqir.id}
      onExpandedChange={(e) => setIsEditing(e)}
      isExpanded={isEditing}
    >
      <Accordion.Header
        className={styles.accordionHeader}
        style={{ borderRadius: isEditing ? "5px 5px 0 0" : "5px" }}
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
          <PQIRListElementTextField
            id={pqir.id}
            value={description}
            userCanEdit={userCanEdit}
            onEdit={(e) => setDescription(e)}
          />
          {userCanEdit && panelSectionBottom}
        </div>
      </Accordion.Panel>
    </Accordion.Item>
  );
};
