import { vsmObject } from "../interfaces/VsmObject";
import React, { useState } from "react";
import styles from "./VSMCanvas.module.scss";
import { taskSorter } from "../utils/taskSorter";
import { taskObject } from "../interfaces/taskObject";
import { TaskButton } from "./TaskButton";
import { EditTaskSection } from "./EditTaskSection";
import { CircleButton } from "./CircleButton";
import { Typography } from "@equinor/eds-core-react";

const NewTaskButton = (props: { onClick: () => void; disabled: boolean }) => (
  <div>
    <CircleButton
      disabled={props.disabled}
      symbol={`+`}
      onClick={() => props.onClick()}
    />
  </div>
);

// eslint-disable-next-line max-lines-per-function
export const QIPSection = (props: {
  object: vsmObject;
  onClickNewTask: () => void;
  canEdit: boolean;
}): JSX.Element => {
  const selectedObject = props.object;
  const [selectedTask, setSelectedTask] = useState(null);

  // Show the edit task section if the selected task relates to the selected vsm object
  const showEditTaskSection = selectedObject.tasks.some(
    (task) => task.vsmTaskID === selectedTask?.vsmTaskID
  );

  return (
    <div className={styles.QIPContainer}>
      <Typography variant={"h3"}>Questions, Ideas and Problems</Typography>

      {showEditTaskSection && (
        <EditTaskSection
          canEdit={props.canEdit}
          object={selectedObject}
          task={selectedTask}
        />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 12,
        }}
      >
        {selectedObject.tasks.length === 0 && (
          <p
            className={props.canEdit && styles.clickable}
            onClick={() => props.canEdit && props.onClickNewTask()}
          >
            {props.canEdit
              ? "Add Question, Idea or Problem"
              : "No question, ideas or problems added"}
          </p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {selectedObject.tasks.sort(taskSorter()).map((task: taskObject) => {
            return (
              <div
                title={`${task?.description}`} //<- hover tooltip
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
        <NewTaskButton
          disabled={!props.canEdit}
          onClick={() => props.onClickNewTask()}
        />
      </div>
    </div>
  );
};
