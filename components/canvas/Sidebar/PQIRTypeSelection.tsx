import { TaskTypes } from "@/types/TaskTypes";
import { getTaskColor } from "@/utils/getTaskColor";
import { TextCircle } from "../entities/TextCircle";
import styles from "./PQIRTypeSelection.module.scss";

type PQIRTypeSelectionProps = {
  selectedType: TaskTypes;
  onClick: (type: TaskTypes) => void;
};

export const PQIRTypeSelection = ({
  selectedType,
  onClick,
}: PQIRTypeSelectionProps) => {
  const pqirTypes = [];
  for (const taskType of Object.values(TaskTypes)) {
    const pqirTypeSelection = (
      <TextCircle
        text={taskType.slice(0, 1)}
        color={getTaskColor(taskType)}
        outlined={taskType !== selectedType}
        onClick={() => onClick(taskType)}
      />
    );
    pqirTypes.push(pqirTypeSelection);
  }
  return <div className={styles.container}>{pqirTypes}</div>;
};
