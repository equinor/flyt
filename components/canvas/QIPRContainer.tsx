import styles from "./QIPRContainer.module.scss";
import { getTaskColor } from "utils/getTaskColor";
import { getQIPRContainerWidth } from "./utils/getQIPRContainerWidth";
import { TextCircle } from "./entities/TextCircle";
import { Task } from "types/Task";
import { getTaskShorthand } from "utils/getTaskShorthand";
import { taskSorter } from "utils/taskSorter";
import { NodeTooltip } from "./NodeTooltip";
import { useState } from "react";
import { NodeTooltipSection } from "./NodeTooltipSection";

export const QIPRContainer = (props: { onClick?(): void; tasks: Task[] }) => {
  const [hoveredTask, setHoveredTask] = useState<Task | undefined>(undefined);

  return (
    props.tasks?.length > 0 && (
      <div
        className={styles.QIPRContainer}
        onClick={props.onClick}
        style={{
          width: getQIPRContainerWidth(props.tasks),
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
                onMouseEnter={() => setHoveredTask(task)}
                onMouseLeave={() => setHoveredTask(undefined)}
              >
                <TextCircle
                  text={getTaskShorthand(task)}
                  color={getTaskColor(task.type)}
                />
              </div>
            );
          })}
        <NodeTooltip isVisible={!!hoveredTask}>
          <div className={styles["tooltip-content"]}>
            <div className={styles["tooltip-qipr-icon"]}>
              <TextCircle
                text={getTaskShorthand(hoveredTask)}
                color={getTaskColor(hoveredTask?.type)}
              />
            </div>
            <NodeTooltipSection text={hoveredTask?.description ?? ""} />
          </div>
        </NodeTooltip>
      </div>
    )
  );
};
