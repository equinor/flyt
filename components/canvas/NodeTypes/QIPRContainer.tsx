import React from "react";
import styles from "./QIPRContainer.module.css";
import { getTaskColor } from "utils/getTaskColor";
import { TextCircle } from "../entities/TextCircle";
import { taskObject } from "interfaces/taskObject";

const sortOrder = ["Problem", "Question", "Idea", "Risk"];

export const QIPRContainer = (props: {
  onClick?(): void;
  tasks: taskObject[];
}) => (
  <div
    className={styles.QIPRContainer}
    onClick={props.onClick}
    style={{
      width: (((props.tasks?.length / 4) >> 0) + 1) * 33,
    }}
  >
    {props.tasks
      .sort((a, b) =>
        a.type !== b.type
          ? sortOrder.indexOf(a.type) - sortOrder.indexOf(b.type)
          : a.number - b.number
      )
      .map((task, index) => (
        <div
          key={index}
          style={{ margin: 2.5, marginLeft: index >= 4 ? 0 : 2.5 }}
        >
          <TextCircle
            text={task.type.slice(0, 1) + (task.number + 1)}
            color={getTaskColor(task)}
          />
        </div>
      ))}
  </div>
);
