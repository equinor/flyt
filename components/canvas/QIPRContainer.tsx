import { useState } from "react";
import { Task } from "types/Task";
import { getTaskColor } from "utils/getTaskColor";
import { getTaskShorthand } from "utils/getTaskShorthand";
import { taskSorter } from "utils/taskSorter";
import { AddQIPRButton } from "./AddQIPRButton";
import { TextCircle } from "./entities/TextCircle";
import { NodeTooltipContainer } from "./NodeTooltip";
import styles from "./QIPRContainer.module.scss";
import { FormatNodeText } from "./utils/FormatNodeText";
import { getQIPRContainerWidth } from "./utils/getQIPRContainerWidth";

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
                  color={getTaskColor(task.type)}
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
              color={getTaskColor(hoveredTask?.type)}
            />
          </div>
          <FormatNodeText
            variant="body_long"
            style={{
              alignSelf: "center",
              paddingLeft: "8px",
              paddingRight: "8px",
            }}
          >
            {hoveredTask?.description ?? ""}
          </FormatNodeText>
        </div>
      </NodeTooltipContainer>
    </div>
  );
};
