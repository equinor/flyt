import { useStoreDispatch, useStoreState } from "../hooks/storeHooks";
import React, { useState } from "react";
import { taskObject } from "../interfaces/taskObject";
import styles from "./VSMCanvas.module.scss";
import { Button, Icon, SingleSelect, TextField } from "@equinor/eds-core-react";
import { vsmTaskTypes } from "../types/vsmTaskTypes";
import { ExistingTaskSection } from "./ExistingTaskSection";
import { arrow_back } from "@equinor/eds-icons";

Icon.add({
  arrow_back,
});

export function NewTaskSection(props: { onClose: () => void }): JSX.Element {
  const dispatch = useStoreDispatch();
  const selectedObject = useStoreState((state) => state.selectedObject);
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
        <Icon name="arrow_back" title="add" size={24} />
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
          const t = {
            objects: [{ fkObject: selectedObject.vsmObjectID }],
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
                dispatch.addTask(newTask);
                clearAndCloseAddTaskSection();
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
