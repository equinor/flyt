import { vsmObject } from "../interfaces/VsmObject";
import { vsmObjectTypes } from "../types/vsmObjectTypes";
import { Button, Icon, SingleSelect, TextField } from "@equinor/eds-core-react";
import styles from "./VSMCanvas.module.scss";
import React, { useEffect, useState } from "react";
import {
  getTimeDefinitionDisplayName,
  getTimeDefinitionValue,
  getTimeDefinitionValues,
} from "../types/timeDefinitions";
import { taskObject } from "../interfaces/taskObject";
import { vsmTaskTypes } from "../types/vsmTaskTypes";
import { TaskButton } from "./TaskButton";
import {
  add,
  add_circle_filled,
  arrow_back,
  close,
  delete_forever,
  delete_to_trash,
} from "@equinor/eds-icons";
import { CircleButton } from "./CircleButton";
import { useStoreDispatch, useStoreState } from "../hooks/storeHooks";
import { debounce } from "../utils/debounce";
import BaseAPIServices from "../services/BaseAPIServices";
import { SideBarHeader } from "./SideBarHeader";
import { ExistingTaskSection } from "./ExistingTaskSection";

Icon.add({
  close,
  delete_forever,
  delete_to_trash,
  add,
  add_circle_filled,
  arrow_back,
});

function DurationComponent(props: {
  selectedObject: vsmObject;
  onChangeName: (event: { target: { value: string } }) => void;
  onChangeRole: (event: { target: { value: string } }) => void;
  onChangeTime: (event: { target: { value: string } }) => void;
  onChangeTimeDefinition: (timeDefinition: string) => void;
}) {
  return (
    <div style={{ display: "flex" }}>
      <TextField
        label={"Duration"}
        type={"number"}
        value={props.selectedObject.time?.toString()}
        id={"vsmObjectTime"}
        onChange={props.onChangeTime}
      />
      <div style={{ padding: 8 }} />
      <SingleSelect
        items={getTimeDefinitionValues()}
        handleSelectedItemChange={(i) => {
          const apiValue = getTimeDefinitionValue(i.selectedItem);
          props.onChangeTimeDefinition(apiValue);
        }}
        initialSelectedItem={getTimeDefinitionDisplayName(
          props.selectedObject.timeDefinition
        )}
        label="Unit"
      />
    </div>
  );
}

export const taskSorter = () => (a: taskObject, b: taskObject): number => {
  if (!!a && !!b) return a.fkTaskType - b.fkTaskType;
  return 1;
};

const NewTaskButton = (props: { onClick: () => void }) => (
  <div>
    <CircleButton symbol={`+`} onClick={() => props.onClick()} />
  </div>
);

/**
 * Process specific content stuff
 * @param props
 * @constructor
 */
export function SideBarContent(props: {
  onChangeName: (event: { target: { value: string } }) => void;
  onChangeRole: (event: { target: { value: string } }) => void;
  onChangeTime: (event: { target: { value: string } }) => void;
  onChangeTimeDefinition: (timeDefinition: string) => void;
  onAddTask: (task: taskObject) => void;
  onClose: () => void;
  onDelete: () => void;
}) {
  const selectedObject = useStoreState((state) => state.selectedObject);
  const { tasks } = selectedObject;
  //Todo: refactor function to be more concise
  const [showNewTaskSection, setShowNewTaskSection] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  //Todo: move to new functional component
  const [newTask, setNewTask] = useState(null);
  const dispatch = useStoreDispatch();

  const [showExistingTaskSection, setShowExistingTaskSection] = useState(false);
  const [existingTaskFilter, setExistingTaskFilter] = useState(null);

  function newTaskIsReady(task: taskObject) {
    return task?.description?.trim().length > 0;
  }

  function clearAndCloseAddTaskSection() {
    setShowNewTaskSection(false);
    setNewTask(null);
    setShowExistingTaskSection(false);
  }

  if (showNewTaskSection) {
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
          <Icon name="arrow_back" title="add" size={16} />
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

  const quips = () => {
    // /*############## QUIP-SECTION ###################################*/
    return (
      <div className={styles.QIPContainer}>
        <div className={styles.headerContainer}>
          <div className={styles.sideBarSectionHeader}>
            <p>Questions, Ideas and Problems</p>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {tasks.sort(taskSorter()).map((task: taskObject) => {
              return (
                <div
                  key={`${task?.vsmTaskID}`}
                  onClick={() => setSelectedTask(task)}
                >
                  <TaskButton
                    key={`${task?.vsmTaskID}`}
                    task={task}
                    selected={selectedTask?.vsmTaskID === task?.vsmTaskID}
                    draft={false}
                  />
                </div>
              );
            })}
          </div>
          <NewTaskButton onClick={() => setShowNewTaskSection(true)} />
        </div>
        {!!selectedTask && (
          <div className={styles.headerContainer}>
            <TextField
              label={"Task description"}
              variant={"default"}
              value={selectedTask.description}
              id={`taskDescription-${selectedTask.vsmTaskID}`}
              onChange={(event) => {
                const t: taskObject = {
                  ...selectedTask,
                  description: event.target.value.substr(0, 4000),
                };
                setSelectedTask(t);
                debounce(
                  () => {
                    dispatch.updateTask(t);
                  },
                  500,
                  "SideBarContent-UpdateTask"
                )();
              }}
              multiline
              rows={5}
            />
            <div>
              {/*Must have the button inside a div for flex size to work correctly...*/}
              <Button
                title={`Delete selected QIP`}
                disabled={!selectedTask}
                variant={"ghost_icon"}
                color={"danger"}
                onClick={() => {
                  dispatch.unlinkTask({
                    projectId: selectedObject.vsmProjectID,
                    vsmObjectId: selectedObject.vsmObjectID,
                    taskId: selectedTask.vsmTaskID,
                  });
                  setSelectedTask(null);
                }}
              >
                <Icon name="delete_to_trash" size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  switch (selectedObject.vsmObjectType.pkObjectType) {
    case vsmObjectTypes.process:
      return (
        <>
          <SideBarHeader
            object={selectedObject}
            onClose={props.onClose}
            onDelete={props.onDelete}
          />
          <div style={{ paddingTop: 8 }}>
            <TextField
              label={"Add title"}
              multiline
              rows={4}
              variant={"default"}
              value={selectedObject.name || ""}
              onChange={props.onChangeName}
              id={"vsmObjectDescription"}
            />
          </div>
        </>
      );
    case vsmObjectTypes.supplier:
      return (
        <>
          <SideBarHeader
            object={selectedObject}
            onClose={props.onClose}
            onDelete={props.onDelete}
          />
          <div style={{ paddingTop: 8 }}>
            <TextField
              label={"Add supplier(s)"}
              multiline
              rows={4}
              variant={"default"}
              value={selectedObject.name || ""}
              onChange={props.onChangeName}
              id={"vsmObjectDescription"}
            />
          </div>
          {quips()}
        </>
      );

    case vsmObjectTypes.input:
      return (
        <>
          <SideBarHeader
            object={selectedObject}
            onClose={props.onClose}
            onDelete={props.onDelete}
          />
          <div style={{ paddingTop: 8 }}>
            <TextField
              label={"Add input(s)"}
              multiline
              rows={4}
              variant={"default"}
              value={selectedObject.name || ""}
              onChange={props.onChangeName}
              id={"vsmObjectDescription"}
            />
          </div>
          {quips()}
        </>
      );

    case vsmObjectTypes.output:
      return (
        <>
          <SideBarHeader
            object={selectedObject}
            onClose={props.onClose}
            onDelete={props.onDelete}
          />
          <div style={{ paddingTop: 8 }}>
            <TextField
              label={"Add output(s)"}
              multiline
              rows={4}
              variant={"default"}
              value={selectedObject.name || ""}
              onChange={props.onChangeName}
              id={"vsmObjectDescription"}
            />
          </div>
          {quips()}
        </>
      );
    case vsmObjectTypes.customer:
      return (
        <>
          <SideBarHeader
            object={selectedObject}
            onClose={props.onClose}
            onDelete={props.onDelete}
          />
          <div style={{ paddingTop: 8 }}>
            <TextField
              label={"Add customer(s)"}
              multiline
              rows={4}
              variant={"default"}
              value={selectedObject.name || ""}
              onChange={props.onChangeName}
              id={"vsmObjectDescription"}
            />
          </div>
          {quips()}
        </>
      );
    case vsmObjectTypes.mainActivity:
      return (
        <>
          <SideBarHeader
            object={selectedObject}
            onClose={props.onClose}
            onDelete={props.onDelete}
          />
          <div style={{ paddingTop: 8 }}>
            <TextField
              label={"Add description"}
              multiline
              rows={4}
              variant={"default"}
              value={selectedObject.name || ""}
              onChange={props.onChangeName}
              id={"vsmObjectDescription"}
            />
          </div>
        </>
      );
    case vsmObjectTypes.subActivity:
      return (
        <>
          <SideBarHeader
            object={selectedObject}
            onClose={props.onClose}
            onDelete={props.onDelete}
          />
          <div style={{ paddingTop: 8 }}>
            <TextField
              label={"Add description"}
              multiline
              rows={4}
              variant={"default"}
              value={selectedObject.name || ""}
              onChange={props.onChangeName}
              id={"vsmObjectDescription"}
            />
          </div>
          <div style={{ paddingTop: 12 }}>
            <TextField
              label={"Role(s)"}
              variant={"default"}
              value={selectedObject.role?.toString()}
              id={"vsmObjectRole"}
              onChange={props.onChangeRole}
            />
            <div style={{ padding: 8 }} />
            <DurationComponent {...props} selectedObject={selectedObject} />
          </div>
          {quips()}
        </>
      );
    case vsmObjectTypes.waiting:
      return (
        <>
          <DurationComponent {...props} selectedObject={selectedObject} />
          {quips()}
        </>
      );
    case vsmObjectTypes.choice:
      return (
        <>
          <SideBarHeader
            object={selectedObject}
            onClose={props.onClose}
            onDelete={props.onDelete}
          />
          <div style={{ paddingTop: 8 }}>
            <TextField
              label={"Define choice"}
              multiline
              rows={4}
              variant={"default"}
              value={selectedObject.name}
              onChange={props.onChangeName}
              id={"vsmObjectDescription"}
            />
          </div>
        </>
      );
    default:
      return <p>Invalid process type</p>;
  }
}
