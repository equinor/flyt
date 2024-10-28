import styles from "./QIPRContainer.module.scss";
import { getTaskColor } from "utils/getTaskColor";
import { getQIPRContainerWidth } from "./utils/getQIPRContainerWidth";
import { TextCircle } from "./entities/TextCircle";
import { Task } from "types/Task";
import { getTaskShorthand } from "utils/getTaskShorthand";
import { taskSorter } from "utils/taskSorter";
import { NodeTooltipContainer } from "./NodeTooltip";
import { useState } from "react";
import { NodeTooltipSection } from "./NodeTooltipSection";
import { AddQIPRButton } from "./AddQIPRButton";

export const QIPRContainer = (props: { onClick?(): void; tasks: Task[] }) => {
  const [hoveredTask, setHoveredTask] = useState<Task | undefined>(undefined);

  return (
    <div
      className={styles.QIPRContainer}
      onClick={(e) => {
        e.stopPropagation();
        props.onClick?.();
      }}
      style={{
        width: getQIPRContainerWidth(props.tasks),
      }}
    >
      {props.tasks.length === 0 ? (
        <AddQIPRButton onClick={() => undefined} />
      ) : (
        props.tasks
          ?.filter((task) => !task.solved)
          .sort(taskSorter())
          .map((task, index) => {
            return (
              <div
                key={index}
                style={{ margin: 2.5, marginLeft: index >= 4 ? 0 : 2.5 }}
                onMouseEnter={() => setHoveredTask(task)}
                onMouseLeave={() => setHoveredTask(undefined)}
              >
                <TextCircle
                  text={getTaskShorthand(task)}
                  color={getTaskColor(task)}
                />
              </div>
            );
          })
      )}
      <NodeTooltipContainer isVisible={!!hoveredTask}>
        <div className={styles["tooltip-content"]}>
          <div className={styles["tooltip-qipr-icon"]}>
            <TextCircle
              text={getTaskShorthand(hoveredTask)}
              color={getTaskColor(hoveredTask)}
            />
          </div>
          <NodeTooltipSection text={hoveredTask?.description ?? ""} />
        </div>
      </NodeTooltipContainer>
    </div>
  );
};
