import { Task } from "@/types/Task";
import {
  Accordion,
  Button,
  Checkbox,
  Icon,
  TextField,
  Typography,
} from "@equinor/eds-core-react";
import { TextCircle } from "../entities/TextCircle";
import { ChangeEvent } from "react";
import { add, delete_to_trash, minimize } from "@equinor/eds-icons";
import styles from "./PQIRListElement.module.scss";
import { PQIRTypeSelection } from "./PQIRTypeSelection";
import { NodeDataCommon } from "@/types/NodeData";
import { usePQIR } from "./usePQIR";

type PQIRListElement = {
  pqir: Task;
  isSelectedSection?: boolean;
  selectedNode: NodeDataCommon;
};

export const PQIRListELement = ({
  pqir,
  isSelectedSection,
  selectedNode,
}: PQIRListElement) => {
  const {
    linkPQIR,
    unlinkPQIR,
    description,
    setDescription,
    selectedType,
    setSelectedType,
    solved,
    setSolved,
    color,
    shorthand,
  } = usePQIR(pqir, selectedNode);

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

  return (
    <Accordion.Item
      className={styles.container}
      chevronPosition="left"
      key={pqir.id}
    >
      <Accordion.Header className={styles.accordionHeader}>
        <TextCircle text={shorthand} color={color} />
        <Typography>{pqir.description}</Typography>
        {selectOrDeselectButton}
      </Accordion.Header>
      <Accordion.Panel className={styles.panel}>
        <div className={styles.panelContent}>
          <div className={styles["panel-top"]}>
            <PQIRTypeSelection
              selectedType={selectedType}
              onClick={(type) => setSelectedType(type)}
            />
            <div>
              {solved !== null && (
                <Checkbox
                  defaultChecked={solved}
                  onChange={(e) => setSolved(e.target.checked)}
                />
              )}
              <Button variant="ghost_icon">
                <Icon data={delete_to_trash} />
              </Button>
            </div>
          </div>
          <TextField
            id={pqir.id}
            value={description}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDescription(e.target.value)
            }
            multiline
            rows={5}
            className={styles.textInput}
          />
          <div className={styles.actionButtonsContainer}>
            <Button
              className={styles.actionButton}
              disabled={description !== description}
            >
              Save
            </Button>
          </div>
        </div>
      </Accordion.Panel>
    </Accordion.Item>
  );
};
