import React from "react";
import styles from "./QIPRContainer.module.scss";
import { getTaskColor } from "utils/getTaskColor";
import { getQIPRContainerWidth } from "./utils/getQIPRContainerWidth";
import { TextCircle } from "./entities/TextCircle";
import { taskObject } from "interfaces/taskObject";
import { getTaskShorthand } from "utils/getTaskShorthand";
import { taskSorter } from "utils/taskSorter";

export const QIPRContainer = (props: {
  onClick?(): void;
  tasks: taskObject[];
}) => (
  <div
    className={styles.QIPRContainer}
    onClick={props.onClick}
    style={{
      width: getQIPRContainerWidth(
        props.tasks?.filter((task) => !task.solved).length
      ),
    }}
  >
    {props.tasks
      ?.filter((task) => !task.solved)
      .sort(taskSorter())
      .map((task, index) => {
        return (
          <div
            key={index}
            style={{ margin: 2.5, marginLeft: index >= 4 ? 0 : 2.5 }}
          >
            <TextCircle
              text={getTaskShorthand(task)}
              color={getTaskColor(task)}
            />
          </div>
        );
      })}
  </div>
);
