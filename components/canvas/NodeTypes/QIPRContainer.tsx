import React from "react";
import styles from "./QIPRContainer.module.css";
import { getTaskColor } from "utils/getTaskColor";
import { TextCircle } from "../entities/TextCircle";

export const QIPRContainer = (props) => (
  <div className={styles.QIPRContainer} onClick={props.onClick}>
    {props.tasks.map((task, index) => (
      <div
        key={index}
        style={{ margin: 2.5, marginLeft: index >= 4 ? 0 : 2.5 }}
      >
        <TextCircle text={task.displayIndex} color={getTaskColor(task)} />
      </div>
    ))}
  </div>
);
