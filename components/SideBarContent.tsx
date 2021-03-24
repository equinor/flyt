import { vsmObject } from "../interfaces/VsmObject";
import { vsmObjectTypes } from "../types/vsmObjectTypes";
import {
  Button,
  Checkbox,
  Icon,
  SingleSelect,
  TextField,
} from "@equinor/eds-core-react";
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
  close,
  delete_forever,
  arrow_back,
  delete_to_trash,
} from "@equinor/eds-icons";
import { CircleButton } from "./CircleButton";
import { useStoreDispatch, useStoreState } from "../hooks/storeHooks";
import { debounce } from "../utils/debounce";
import BaseAPIServices from "../services/BaseAPIServices";

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

  const [showExistingTaskSection, setShowExistingTaskSection] = useState(false);
  const [existingTaskFilter, setExistingTaskFilter] = useState(null);

  const [fetchingTasks, setFetchingTasks] = useState(false);
  const [fetchingTasksError, setFetchingTasksError] = useState(false);

  const [existingTasks, setExistingTasks] = useState([]);

  useEffect(() => {
    if (existingTaskFilter) {
      setFetchingTasks(true);
      setFetchingTasksError(null);
      setExistingTasks([]);
      BaseAPIServices.get(
        `/api/v1.0/task/list/${selectedObject.vsmProjectID}/${existingTaskFilter}`
      )
        .then((value) => setExistingTasks(value.data))
        .catch((reason) => {
          setFetchingTasksError(reason);
        })
        .finally(() => setFetchingTasks(false));
    }
  }, [existingTaskFilter]);

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
          <p>Add QIP</p>
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
        {showExistingTaskSection && (
          <div>
            {fetchingTasksError && (
              <p>ERROR: {JSON.stringify(fetchingTasksError)}</p>
            )}
            {fetchingTasks && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 12,
                }}
              >
                <p>Loading...</p>
              </div>
            )}
            {!fetchingTasks && existingTasks.length < 1 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <p>{`Couldn't find any for this vsm.`}</p>
                <p>Try adding one.</p>
              </div>
            )}
            <div>
              <ul style={{ margin: "0", padding: "0", listStyleType: "none" }}>
                {existingTasks.map((t: taskObject) => (
                  <li key={t.vsmTaskID}>
                    <Checkbox
                      defaultChecked={tasks.some(
                        (task) => task?.vsmTaskID === t?.vsmTaskID
                      )}
                      label={`${t.vsmTaskID} - ${t.description?.substr(
                        0,
                        140
                      )}`}
                      onChange={(event) => {
                        if (event.target.checked) {
                          console.log("link it!");
                          dispatch.linkTask({
                            taskId: t.vsmTaskID,
                            projectId: selectedObject.vsmProjectID,
                            vsmObjectId: selectedObject.vsmObjectID,
                            task: t,
                          });
                        } else {
                          dispatch.unlinkTask({
                            taskId: t.vsmTaskID,
                            projectId: selectedObject.vsmProjectID,
                            vsmObjectId: selectedObject.vsmObjectID,
                          });
                          console.log("unlink it");
                        }
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
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
