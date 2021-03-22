import { vsmObject } from "../interfaces/VsmObject";
import { vsmObjectTypes } from "../types/vsmObjectTypes";
import { Button, Icon, SingleSelect, TextField } from "@equinor/eds-core-react";
import styles from "./VSMCanvas.module.scss";
import React, { useState } from "react";
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
  close,
  delete_forever,
  delete_to_trash,
} from "@equinor/eds-icons";
import { CircleButton } from "./CircleButton";
import { useStoreDispatch, useStoreState } from "../hooks/storeHooks";
import { debounce } from "../utils/debounce";

Icon.add({ close, delete_forever, delete_to_trash, add, add_circle_filled });

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
  <CircleButton symbol={`+`} onClick={() => props.onClick()} />
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
}) {
  const selectedObject = useStoreState((state) => state.selectedObject);
  const { tasks } = selectedObject;
  //Todo: refactor function to be more concise
  const [showNewTaskSection, setShowNewTaskSection] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  //Todo: move to new functional component
  const [newTask, setNewTask] = useState(null);
  const dispatch = useStoreDispatch();

  function newTaskIsReady(task: taskObject) {
    return task?.description?.trim().length > 0;
  }

  function clearAndCloseNewTaskSection() {
    setShowNewTaskSection(false);
    setNewTask(null);
  }

  if (showNewTaskSection) {
    return (
      <div className={styles.newTaskSection}>
        <div className={styles.sideBarSectionHeader}>
          <p>Add QIP</p>
        </div>
        <SingleSelect
          autoFocus
          items={[
            "Problem",
            "Idea",
            "Question",
            // "Existing Problem", // Todo: "Existing Problem"
            // "Existing Idea", //Todo: "Existing Idea"
            // "Existing Question", //Todo: "Existing Question"
          ]}
          handleSelectedItemChange={(e) => {
            const t = {
              objects: [{ fkObject: selectedObject.vsmObjectID }],
              fkProject: selectedObject.vsmProjectID,
              description: newTask?.description ?? "", // Let's not overwrite description if we change the type midways
            } as taskObject;

            if (e.selectedItem === "Problem") {
              t.fkTaskType = vsmTaskTypes.problem;
            } else if (e.selectedItem === "Idea") {
              t.fkTaskType = vsmTaskTypes.idea;
            } else if (e.selectedItem === "Question") {
              t.fkTaskType = vsmTaskTypes.question;
            }
            setNewTask(t);
          }}
          label="Select type"
        />
        {newTask && (
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
        )}
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
            onClick={() => clearAndCloseNewTaskSection()}
          >
            Cancel
          </Button>
          <Button
            disabled={!newTaskIsReady(newTask)}
            onClick={() => {
              dispatch.addTask(newTask);
              clearAndCloseNewTaskSection();
            }}
          >
            Add
          </Button>
        </div>
      </div>
    );
  }

  const quips = () => {
    // /*############## QUIP-SECTION ###################################*/
    return (
      <div>
        <div className={styles.sideBarSectionHeader}>
          <p>QIP</p>
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
            <NewTaskButton onClick={() => setShowNewTaskSection(true)} />
          </div>
          <div>
            {/*Must have the button inside a div for flex size to work correctly... */}
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
        {!!selectedTask && selectedTask.fkTaskType === vsmTaskTypes.unknown && (
          <>
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
                onClick={() => setNewTask(null)}
              >
                Cancel
              </Button>
              <Button onClick={() => props.onAddTask(selectedTask)}>Add</Button>
            </div>
          </>
        )}
        {!!selectedTask && (
          <div>
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
          </div>
        )}
      </div>
    );
  };

  switch (selectedObject.vsmObjectType.pkObjectType) {
    case vsmObjectTypes.process:
      return (
        <>
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
