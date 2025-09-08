import { useStoreDispatch } from "@/hooks/storeHooks";
import { NodeDataCommon } from "@/types/NodeData";
import { Task } from "@/types/Task";
import {
  Accordion,
  Button,
  Checkbox,
  Icon,
  Tooltip,
  Typography,
} from "@equinor/eds-core-react";
import {
  add,
  delete_to_trash,
  minimize,
  remove_outlined,
} from "@equinor/eds-icons";
import dynamic from "next/dynamic";
import { TextCircle } from "../entities/TextCircle";
import styles from "./PQIRListElement.module.scss";
import { PQIRTypeSelection } from "./PQIRTypeSelection";
import { usePQIR } from "./usePQIR";
import { usePQIRMutations } from "./usePQIRMutations";
import { useState } from "react";
import { PQIRScrim } from "@/components/PQIRScrim";
import { createPortal } from "react-dom";
import { useProjectId } from "@/hooks/useProjectId";
import { getTasksforSelectedNode } from "@/services/taskApi";
import { useReactFlow } from "reactflow";

const MarkdownEditor = dynamic(() => import("components/MarkdownEditor"), {
  ssr: false,
});

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
  const { projectId } = useProjectId();
  const [showScrim, setShowScrim] = useState(false);
  const dispatch = useStoreDispatch();
  const { getNodes } = useReactFlow();
  const selectedNodeId = selectedNode.id;
  const pqirId = pqir.id;
  const nodes = getNodes();

  const handleSaveClick = async () => {
    try {
      const linkedCards: string[] = [];

      for (const node of nodes) {
        const tasks = await getTasksforSelectedNode(projectId, node.id);

        if (tasks.some((task) => task.id === pqir.id && !task.solved)) {
          linkedCards.push(node.id);
        }
      }

      if (solved && linkedCards.length > 1) {
        setShowScrim(true);
      } else {
        updatePQIR.mutate({
          pqir: {
            ...pqir,
            description: description,
            type: selectedType,
            solved: solved,
          },
          selectedNodeId,
          isSolvedSingleCard: false,
        });
      }
    } catch (err) {
      console.error("Error fetching linked cards");
    }
  };
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
      <div></div>
    </div>
  );
  const panelSectionBottom = (
    <div className={styles.actionButtonsContainer}>
      <div className={styles.actionIconContainer}>
        {solved !== null && isSelectedSection && (
          <div className={styles.actioncontainer}>
            <Tooltip title="Mark PQIR as solved" placement="top">
              <Checkbox
                checked={solved}
                onChange={(e) => setSolved(e.target.checked)}
                className={styles.checkBoxStyle}
              />
            </Tooltip>
            <Typography className={styles.actionText}>Solved</Typography>
          </div>
        )}
        {isSelectedSection && (
          <div className={styles.actioncontainer}>
            <Tooltip title="Remove PQIR from selected card" placement="top">
              <Button
                variant="ghost_icon"
                onClick={(e) => {
                  e.stopPropagation();
                  unlinkPQIR.mutate({ selectedNodeId, pqirId });
                }}
                className={styles.actionIcon}
              >
                <Icon data={remove_outlined} />
              </Button>
            </Tooltip>
            <Typography className={styles.actionText}>Remove</Typography>
          </div>
        )}
        <div className={styles.actioncontainer}>
          <Tooltip title="Delete PQIR from process" placement="top">
            <Button
              variant="ghost_icon"
              onClick={() => dispatch.setPQIRToBeDeletedId(pqir.id)}
              className={styles.actionIcon}
            >
              <Icon data={delete_to_trash} />
            </Button>
          </Tooltip>
          <Typography className={styles.actionText}>Delete</Typography>
        </div>
      </div>

      {!(!hasChanges || !description) && (
        <Button onClick={handleSaveClick} className={styles.actionButton}>
          Save
        </Button>
      )}

      {showScrim &&
        createPortal(
          <PQIRScrim
            onClose={() => setShowScrim(false)}
            onSaveThisCard={async () => {
              updatePQIR?.mutate({
                pqir: {
                  ...pqir,
                  description: description,
                  type: selectedType,
                  solved: solved,
                },
                selectedNodeId,
                isSolvedSingleCard: true,
              });

              setShowScrim(false);
            }}
            onSaveAllCards={() => {
              updatePQIR?.mutate({
                pqir: {
                  ...pqir,
                  description: description,
                  type: selectedType,
                  solved: solved,
                },
                selectedNodeId,
                isSolvedSingleCard: false,
              });
              setShowScrim(false);
            }}
          />,
          document.body
        )}
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
