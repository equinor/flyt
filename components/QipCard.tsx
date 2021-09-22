import { taskObject } from "../interfaces/taskObject";
import React, { useState } from "react";
import { getTaskColor } from "../utils/getTaskColor";
import styles from "./QipCard.module.scss";
import { ColorDot } from "./ColorDot";
import { CategoryChip } from "./CategoryChip";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { useMutation, useQueryClient } from "react-query";
import {
  linkTaskCategory,
  unlinkTaskCategory,
} from "../services/taskCategoriesApi";
import { taskCategory } from "../interfaces/taskCategory";

export function QipCard(props: {
  task: taskObject;
  onClick?: () => void;
}): JSX.Element {
  const task = props.task;
  const { displayIndex, description, categories, vsmTaskID, solved } = task;
  const taskColor = getTaskColor(task);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const queryClient = useQueryClient();
  const linkTaskMutation = useMutation(
    (p: { categoryId; taskId }) => {
      setIsLoading(true);
      return linkTaskCategory(p.categoryId, p.taskId);
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(["taskCategories"]).then(() => {
          setIsLoading(false);
          setIsDragOver(false);
        });
      },
    }
  );

  const unlinkTaskMutation = useMutation(
    (p: { categoryId: number; taskId: number }) => {
      setIsLoading(true);
      return unlinkTaskCategory(p.categoryId, p.taskId);
    },
    {
      onSuccess: () => queryClient.invalidateQueries(),
      onSettled: () => setIsLoading(false),
    }
  );

  function getAlreadyThere(data: { text: string; color: string; id: number }) {
    return categories?.some((c) => c.id === data.id);
  }

  return (
    <div
      style={{
        transform: (isDragOver || isLoading) && "scale(0.98)",
        opacity: (isDragOver || isLoading) && 0.4,
        borderStyle: isDragOver && "dashed",
      }}
      onClick={props.onClick}
      onDrop={(event) => {
        const data: { text: string; color: string; id: number } = JSON.parse(
          event.dataTransfer.getData("text/plain")
        );
        const alreadyThere = getAlreadyThere(data);
        if (alreadyThere) {
          setIsDragOver(false);
        } else {
          linkTaskMutation.mutate({
            categoryId: data.id,
            taskId: vsmTaskID,
          });
        }
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragEnterCapture={(event) => {
        const data: { text: string; color: string; id: number } = JSON.parse(
          event.dataTransfer.getData("text/plain")
        );
        const alreadyThere = getAlreadyThere(data);
        if (!alreadyThere) {
          setIsDragOver(true);
        }
      }}
      onDragExitCapture={() => setIsDragOver(false)}
      className={styles.qipCard}
    >
      {solved && <span className={styles.stamp}>Solved</span>}
      <div className={styles.qipCardTop}>
        <ColorDot color={taskColor} />
        <p>{displayIndex || "?"}</p>
      </div>
      <ReactMarkdown remarkPlugins={[gfm]}>{description}</ReactMarkdown>
      <div className={styles.qipCardCategorySection}>
        {categories?.map((category: taskCategory) => (
          <CategoryChip
            key={category.id}
            text={category.name}
            onClickRemove={() => {
              unlinkTaskMutation.mutate({
                categoryId: category.id,
                taskId: vsmTaskID,
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}
