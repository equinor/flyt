import { useEffect, useState } from "react";

import { CircleButton } from "./CircleButton";
import { EditTaskSection } from "./EditTaskSection";
import { TaskButton } from "./TaskButton";
import { Typography } from "@equinor/eds-core-react";
import styles from "./VSMCanvas.module.scss";
import { Task } from "@/types/Task";
import { taskSorter } from "@/utils/taskSorter";
import { NodeDataInteractable } from "../types/NodeData";

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
  object: NodeDataInteractable;
  onClickNewTask: () => void;
  canEdit: boolean;
}) => {
  const selectedNode = props.object;
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  // Show the edit task section if the selected task relates to the selected vsm object
  const showEditTaskSection = selectedNode.tasks.some(
    (task) => task.id === selectedTask?.id
  );

  useEffect(() => {
    if (selectedTask) {
      const updatedTask = selectedNode.tasks.find(
        (task) => task.id === selectedTask.id
      );
      setSelectedTask(updatedTask);
    }
  }, [selectedNode]);

  return (
    <div className={styles.QIPContainer}>
      <Typography variant={"h3"}>
        Questions, Ideas, Problems and Risks
      </Typography>

      {showEditTaskSection && selectedTask && (
        <EditTaskSection
          canEdit={props.canEdit}
          object={selectedNode}
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
        {selectedNode.tasks.length === 0 && (
          <p
            className={props.canEdit ? styles.clickable : ""}
            onClick={() => props.canEdit && props.onClickNewTask()}
          >
            {props.canEdit
              ? "Add question, idea, problem or risk"
              : "No questions, ideas, problems or risks added"}
          </p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {selectedNode.tasks.sort(taskSorter()).map((task: Task) => {
            return (
              <div
                title={`${task?.description}`} //<- hover tooltip
                key={`${task?.id}`}
                onClick={() => setSelectedTask(task)}
              >
                <TaskButton
                  key={`${task?.id}`}
                  task={task}
                  selected={selectedTask?.id === task?.id}
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
