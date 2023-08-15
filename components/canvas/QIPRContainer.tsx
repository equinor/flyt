import React from "react";
import styles from "./QIPRContainer.module.scss";
import { getTaskColor } from "utils/getTaskColor";
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
      width: (((props.tasks?.length / 4.00001) >> 0) + 1) * 33 + 2.5,
    }}
  >
    {props.tasks.sort(taskSorter()).map((task, index) => {
      if (!task.solved) {
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
      }
    })}
  </div>
);
