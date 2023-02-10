import React from "react";
import styles from "./QIPRContainer.module.css";
import { getTaskColor } from "utils/getTaskColor";
import { TextCircle } from "../entities/TextCircle";
import { taskObject } from "interfaces/taskObject";

export const QIPRContainer = (props: {
  onClick?(): void;
  tasks: taskObject[];
}) => (
  <div className={styles.QIPRContainer} onClick={props.onClick}>
    {props.tasks.map((task, index) => (
      <div
        key={index}
        style={{ margin: 2.5, marginLeft: index >= 4 ? 0 : 2.5 }}
      >
        <TextCircle text={""} color={getTaskColor(task)} />
      </div>
    ))}
  </div>
);
