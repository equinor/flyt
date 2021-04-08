import { vsmObject } from "../interfaces/VsmObject";
import React, { useState } from "react";
import styles from "./VSMCanvas.module.scss";
import { taskSorter } from "../utils/taskSorter";
import { taskObject } from "../interfaces/taskObject";
import { TaskButton } from "./TaskButton";
import { EditTaskSection } from "./EditTaskSection";
import { CircleButton } from "./CircleButton";

const NewTaskButton = (props: { onClick: () => void }) => (
  <div>
    <CircleButton symbol={`+`} onClick={() => props.onClick()} />
  </div>
);

export const QIPSection = (props: {
  object: vsmObject;
  onClickNewTask: () => void;
}) => {
  const selectedObject = props.object;
  const [selectedTask, setSelectedTask] = useState(null);

  // Show the edit task section if the selected task relates to the selected vsm object
  const showEditTaskSection = selectedObject.tasks.some(
    (task) => task.vsmTaskID === selectedTask?.vsmTaskID
  );

  return (
    <div className={styles.QIPContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.sideBarSectionHeader}>
          <p>Questions, Ideas and Problems</p>
        </div>
      </div>

      {showEditTaskSection && (
        <EditTaskSection object={selectedObject} task={selectedTask} />
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
            className={styles.clickable}
            onClick={() => props.onClickNewTask()}
          >
            Add Question, Idea or Problem
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
        <NewTaskButton onClick={() => props.onClickNewTask()} />
      </div>
    </div>
  );
};
