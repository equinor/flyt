import { Task } from "../types/Task";
import { useState } from "react";
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
import { TaskCategory } from "../types/TaskCategory";
import { useRouter } from "next/router";
import { getTaskShorthand } from "utils/getTaskShorthand";

export function QipCard(props: {
  task: Task;
  onClick?: () => void;
}): JSX.Element {
  const task = props.task;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { description, category: categories, id: taskId, solved } = task;
  const taskColor = getTaskColor(task);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const queryClient = useQueryClient();
  const linkTaskMutation = useMutation(
    (p: { categoryId; taskId }) => {
      setIsLoading(true);
      return linkTaskCategory(id, p.categoryId, p.taskId);
    },
    {
      onSuccess: (message) => console.log(message),
      onError: (error) => console.log(`${error}`),
      onSettled: () => {
        queryClient.invalidateQueries(["tasks", id]).then(() => {
          setIsLoading(false);
          setIsDragOver(false);
        });
      },
    }
  );

  const unlinkTaskMutation = useMutation(
    (p: { categoryId: number; taskId: string }) => {
      setIsLoading(true);
      return unlinkTaskCategory(id, p.categoryId, p.taskId);
    },
    {
      onSettled: () => {
        queryClient
          .invalidateQueries(["tasks", id])
          .then(() => setIsLoading(false));
      },
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
            taskId: taskId,
          });
        }
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragEnterCapture={(event) => {
        event.stopPropagation();
        const dragData = event.dataTransfer.getData("text/plain");
        if (!dragData) return;
        const data: { text: string; color: string; id: number } =
          JSON.parse(dragData);
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
        <p>{getTaskShorthand(task) || "?"}</p>
      </div>
      <ReactMarkdown remarkPlugins={[gfm]}>{description}</ReactMarkdown>
      <div className={styles.qipCardCategorySection}>
        {categories?.map((category: TaskCategory) => (
          <CategoryChip
            key={category.id}
            text={category.name}
            onClickRemove={() => {
              unlinkTaskMutation.mutate({
                categoryId: category.id,
                taskId: taskId,
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}
