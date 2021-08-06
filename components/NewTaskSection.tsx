import { useStoreDispatch } from "../hooks/storeHooks";
import React, { useState } from "react";
import { taskObject } from "../interfaces/taskObject";
import styles from "./VSMCanvas.module.scss";
import { Button, Icon, SingleSelect, TextField } from "@equinor/eds-core-react";
import { vsmTaskTypes } from "../types/vsmTaskTypes";
import { ExistingTaskSection } from "./ExistingTaskSection";
import { arrow_back } from "@equinor/eds-icons";
import { useMutation, useQueryClient } from "react-query";
import { createTask } from "../services/taskApi";
import { unknownErrorToString } from "utils/isError";
import { vsmObject } from "../interfaces/VsmObject";

export function NewTaskSection(props: {
  onClose: () => void;
  selectedObject;
}): JSX.Element {
  const dispatch = useStoreDispatch();
  const selectedObject = props.selectedObject;
  const queryClient = useQueryClient();
  const taskMutations = useMutation((task: taskObject) => createTask(task), {
    onSuccess() {
      clearAndCloseAddTaskSection();
      return queryClient.invalidateQueries();
    },
    onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
  });
  const [newTask, setNewTask] = useState(null);

  const [existingTaskFilter, setExistingTaskFilter] = useState(null);
  const [showExistingTaskSection, setShowExistingTaskSection] = useState(false);

  function newTaskIsReady(task: taskObject) {
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
        <p>Add Questions, Ideas and Problems</p>
      </div>
      <SingleSelect
        autoFocus
        items={[
          "Problem",
          "Idea",
          "Question",
          "Existing Problem",
          "Existing Idea",
          "Existing Question",
        ]}
        handleSelectedItemChange={(e) => {
          if (!selectedObject) throw new Error("No selected object");
          const t = {
            objects: [{ fkObject: selectedObject.vsmObjectID } as vsmObject],
            fkProject: selectedObject.vsmProjectID,
            description: newTask?.description ?? "", // Let's not overwrite description if we change the type midways
          } as taskObject;

          switch (e.selectedItem) {
            case "Problem":
              t.fkTaskType = vsmTaskTypes.problem;
              setNewTask(t);
              setShowExistingTaskSection(false);
              break;
            case "Idea":
              t.fkTaskType = vsmTaskTypes.idea;
              setNewTask(t);
              setShowExistingTaskSection(false);
              break;
            case "Question":
              t.fkTaskType = vsmTaskTypes.question;
              setNewTask(t);
              setShowExistingTaskSection(false);
              break;
            case "Existing Problem":
              setShowExistingTaskSection(true);
              setExistingTaskFilter(vsmTaskTypes.problem);
              break;
            case "Existing Idea":
              setShowExistingTaskSection(true);
              setExistingTaskFilter(vsmTaskTypes.idea);
              break;
            case "Existing Question":
              setShowExistingTaskSection(true);
              setExistingTaskFilter(vsmTaskTypes.question);
              break;
          }
        }}
        label="Select type"
      />
      <ExistingTaskSection
        visible={showExistingTaskSection}
        selectedObject={selectedObject}
        existingTaskFilter={existingTaskFilter}
      />
      {!showExistingTaskSection && newTask && (
        <>
          <div style={{ paddingTop: 8 }}>
            <TextField
              label={"Description"}
              variant={"default"}
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
