import { taskObject } from "../interfaces/taskObject";
import React, { useState } from "react";
import { getTaskColor } from "../utils/getTaskColor";
import styles from "./QipCard.module.scss";
import { ColorDot } from "./ColorDot";
import { CategoryChip } from "./CategoryChip";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

export function QipCard(props: {
  task: taskObject;
  onClick?: () => void;
}): JSX.Element {
  const [categories, setCategories] = useState([]);
  const taskColor = getTaskColor(props.task);
  return (
    <div
      onClick={props.onClick}
      onDrop={(event) => {
        const data: { text: string; color: string } = JSON.parse(
          event.dataTransfer.getData("text/plain")
        );
        const alreadyThere = categories?.find(
          (category) => category.text === data.text
        );
        if (!alreadyThere) {
          setCategories([...categories, data]);
        }
      }}
      onDragOver={(e) => e.preventDefault()}
      className={styles.qipCard}
    >
      {props.task.solved && <span className={styles.stamp}>Solved</span>}
      <div className={styles.qipCardTop}>
        <ColorDot color={taskColor} />
        <p>{props.task?.displayIndex || "?"}</p>
      </div>
      <ReactMarkdown remarkPlugins={[gfm]}>
        {props.task?.description}
      </ReactMarkdown>
      <div className={styles.qipCardCategorySection}>
        {categories
          .sort((a, b) => {
            return a.text > b.text ? 1 : 0;
          })
          .map((category) => (
            <CategoryChip
              key={category.text}
              text={category.text}
              color={category.color}
              onClickRemove={() =>
                setCategories(
                  categories.filter((c) => c.text !== category.text)
                )
              }
            />
          ))}
      </div>
    </div>
  );
}
