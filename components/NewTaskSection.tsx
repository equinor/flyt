import { useStoreDispatch } from "../hooks/storeHooks";
import { useState } from "react";
import { Task } from "../types/Task";
import styles from "./VSMCanvas.module.scss";
import { Button, Icon, Autocomplete, TextField } from "@equinor/eds-core-react";
import { TaskTypes } from "../types/TaskTypes";
import { ExistingTaskSection } from "./ExistingTaskSection";
import { arrow_back } from "@equinor/eds-icons";
import { useMutation, useQueryClient } from "react-query";
import { createTask } from "../services/taskApi";
import { unknownErrorToString } from "utils/isError";
import { notifyOthers } from "../services/notifyOthers";
import { useAccount, useMsal } from "@azure/msal-react";
import { useProjectId } from "@/hooks/useProjectId";

export function NewTaskSection(props: {
  onClose: () => void;
  selectedNode;
}): JSX.Element {
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const dispatch = useStoreDispatch();
  const selectedNode = props.selectedNode;

  const { projectId } = useProjectId();

  const queryClient = useQueryClient();
  const taskMutations = useMutation(
    (task: Task) => createTask(task, selectedNode.projectId, selectedNode.id),
    {
      onSuccess: () => {
        clearAndCloseAddTaskSection();
        notifyOthers(`Created a new Q/I/P/R`, projectId, account);
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );
  const [newTask, setNewTask] = useState(null);

  const [existingTaskFilter, setExistingTaskFilter] = useState(null);
  const [showExistingTaskSection, setShowExistingTaskSection] = useState(false);

  function newTaskIsReady(task: Task) {
    return task?.description?.trim().length > 0;
  }

  function clearAndCloseAddTaskSection() {
    setNewTask(null);
    setShowExistingTaskSection(false);
    props.onClose();
  }

  return (
    <div className={styles.newTaskSection}>
      <Button
        title={"Go back"}
        variant={"ghost_icon"}
        color={"primary"}
        onClick={() => {
          clearAndCloseAddTaskSection();
        }}
      >
        <Icon data={arrow_back} title="add" size={24} />
      </Button>
      <div className={styles.sideBarSectionHeader}>
        <p>Add Questions, Ideas, Problems and Risks</p>
      </div>
      <Autocomplete
        autoFocus
        options={[
          "Problem",
          "Idea",
          "Question",
          "Risk",
          "Existing Problem",
          "Existing Idea",
          "Existing Question",
          "Existing Risk",
        ]}
        onInputChange={(e) => {
          if (!selectedNode) throw new Error("No selected object");
          const t = {
            type: newTask?.type,
            description: newTask?.description ?? "", // Let's not overwrite description if we change the type midways
          } as Task;

          switch (e) {
            case "Problem":
              t.type = TaskTypes.problem;
              setNewTask(t);
              setShowExistingTaskSection(false);
              break;
            case "Idea":
              t.type = TaskTypes.idea;
              setNewTask(t);
              setShowExistingTaskSection(false);
              break;
            case "Question":
              t.type = TaskTypes.question;
              setNewTask(t);
              setShowExistingTaskSection(false);
              break;
            case "Risk":
              t.type = TaskTypes.risk;
              setNewTask(t);
              setShowExistingTaskSection(false);
              break;
            case "Existing Problem":
              setShowExistingTaskSection(true);
              setExistingTaskFilter(TaskTypes.problem);
              break;
            case "Existing Idea":
              setShowExistingTaskSection(true);
              setExistingTaskFilter(TaskTypes.idea);
              break;
            case "Existing Question":
              setShowExistingTaskSection(true);
              setExistingTaskFilter(TaskTypes.question);
              break;
            case "Existing Risk":
              setShowExistingTaskSection(true);
              setExistingTaskFilter(TaskTypes.risk);
              break;
          }
        }}
        label="Select type"
      />
      <ExistingTaskSection
        visible={showExistingTaskSection}
        selectedNode={selectedNode}
        existingTaskFilter={existingTaskFilter}
      />
      {!showExistingTaskSection && newTask && (
        <>
          <div style={{ paddingTop: 8 }}>
            <TextField
              label={"Description"}
              value={newTask.description}
              id={`newTask`}
              onChange={(event) =>
                setNewTask({ ...newTask, description: event.target.value })
              }
              multiline
              rows={5}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: 12,
            }}
          >
            <Button
              style={{ marginRight: 8 }}
              variant={"outlined"}
              onClick={() => clearAndCloseAddTaskSection()}
            >
              Cancel
            </Button>
            <Button
              disabled={!newTaskIsReady(newTask)}
              onClick={() => {
                taskMutations.mutate(newTask);
              }}
            >
              Add
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
