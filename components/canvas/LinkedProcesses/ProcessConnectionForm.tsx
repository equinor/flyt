import { useFormSteps } from "@/hooks/useFormSteps";
import { EdgeDataApi } from "@/types/EdgeDataApi";
import { NodeDataApi } from "@/types/NodeDataApi";
import { NodeTypes } from "@/types/NodeTypes";
import { Project } from "@/types/Project";
import { Button, Dialog, Icon, Typography } from "@equinor/eds-core-react";
import { close } from "@equinor/eds-icons";
import { useState } from "react";
import { Position, ReactFlowProvider } from "reactflow";
import { useFlowState } from "../hooks/useFlowState";
import { useNodeAdd } from "../hooks/useNodeAdd";
import { getQueryAllProcesses } from "../utils/projectQueries";
import styles from "./ProcessConnectionForm.module.scss";
import { ProcessConnectionFormStepConfirmation } from "./ProcessConnectionFormStepConfirmation";
import { ProcessConnectionFormStepFlow } from "./ProcessConnectionFormStepFlow";
import { ProcessConnectionFormStepProjectList } from "./ProcessConnectionFormStepProjectList";
import { useAccess } from "../hooks/useAccess";

type ProcessConnectionFormProps = {
  project: Project;
  onClose: () => void;
  apiNodes: NodeDataApi[];
  apiEdges: EdgeDataApi[];
};

const ProcessConnectionForm = ({
  project,
  onClose,
  apiNodes,
  apiEdges,
}: ProcessConnectionFormProps) => {
  const query = getQueryAllProcesses(35);
  const { step, incStep, decStep } = useFormSteps();
  const [selectedCard, setSelectedCard] = useState<Project | undefined>(
    undefined
  );
  const { nodes, edges, selectedNode } = useFlowState(
    apiNodes,
    apiEdges,
    false,
    [NodeTypes.supplier, NodeTypes.customer]
  );
  const { addNode } = useNodeAdd();
  const { userCanEdit } = useAccess(project);

  const handleConfirm = () => {
    if (!selectedNode || !selectedCard) return;
    const parentId = selectedNode.id;
    const data = {
      type: NodeTypes.linkedProcess,
      LinkedProject: selectedCard.vsmProjectID,
    };
    addNode(parentId, data, Position.Bottom);
    onClose();
  };

  const steps = [
    {
      content: <ProcessConnectionFormStepFlow nodes={nodes} edges={edges} />,
      actions: (
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!selectedNode} onClick={incStep}>
            Next
          </Button>
        </>
      ),
    },
    {
      content: (
        <ProcessConnectionFormStepProjectList
          selectedCard={selectedCard}
          onCardClick={setSelectedCard}
          query={query}
        />
      ),
      actions: (
        <>
          <Button variant="ghost" onClick={decStep}>
            Back
          </Button>
          <Button disabled={!selectedCard} onClick={incStep}>
            Next
          </Button>
        </>
      ),
    },
    {
      content: (
        <ProcessConnectionFormStepConfirmation
          project={project}
          selectedCard={selectedCard}
          selectedNode={selectedNode}
        />
      ),
      actions: (
        <>
          <Button variant="ghost" onClick={decStep}>
            Back
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </>
      ),
    },
  ];

  return (
    <Dialog open onClose={onClose} isDismissable className={styles.container}>
      <Dialog.Header>
        <Dialog.Title className={styles.title}>Connect Process</Dialog.Title>
        <Button onClick={onClose} variant="ghost_icon">
          <Icon data={close} />
        </Button>
      </Dialog.Header>
      {!userCanEdit ? (
        <Dialog.CustomContent className={styles["custom-content-container"]}>
          <Typography variant="h2">
            You do not have permission to connect this process to other
            processes.
          </Typography>
        </Dialog.CustomContent>
      ) : (
        <>
          <Dialog.CustomContent className={styles["custom-content-container"]}>
            {steps[step].content}
          </Dialog.CustomContent>
          <Dialog.Actions className={styles["actions-container"]}>
            {steps[step].actions}
          </Dialog.Actions>
        </>
      )}
    </Dialog>
  );
};

export const ProcessConnectionFormWrapper = (
  props: ProcessConnectionFormProps
) => {
  return (
    <ReactFlowProvider>
      <ProcessConnectionForm {...props} />
    </ReactFlowProvider>
  );
};
