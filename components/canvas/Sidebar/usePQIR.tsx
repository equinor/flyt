import { NodeDataCommon } from "@/types/NodeData";
import { Task } from "@/types/Task";
import { TaskTypes } from "@/types/TaskTypes";
import { useEffect, useState } from "react";
import { getTaskColor } from "@/utils/getTaskColor";
import { getTaskShorthand } from "@/utils/getTaskShorthand";

export const usePQIR = (pqir: Task | null, selectedNode: NodeDataCommon) => {
  const [isEditing, setIsEditing] = useState(false);

  const solvedDefaultValue = !pqir ? false : pqir.solved;
  const [solved, setSolved] = useState(solvedDefaultValue);

  const descriptionDefaultValue = pqir?.description || "";
  const [description, setDescription] = useState(descriptionDefaultValue);

  const selectedTypeDefaultValue = pqir?.type || TaskTypes.Problem;
  const [selectedType, setSelectedType] = useState(selectedTypeDefaultValue);

  const color = getTaskColor(pqir?.type, pqir?.solved);
  const shorthand = getTaskShorthand(pqir || undefined);

  const hasChanges =
    solvedDefaultValue !== solved ||
    descriptionDefaultValue !== description ||
    selectedTypeDefaultValue !== selectedType;

  const setDefaultValues = () => {
    setSolved(solvedDefaultValue);
    setDescription(descriptionDefaultValue);
    setSelectedType(selectedTypeDefaultValue);
  };

  useEffect(() => {
    setDefaultValues();
  }, [selectedNode]);

  const handleEditing = (isEditingCurrent: boolean) => {
    !isEditingCurrent && setDefaultValues();
    setIsEditing(isEditingCurrent);
  };

  const handleSetSelectedType = (type: TaskTypes) => {
    const solvableType = [TaskTypes.Problem, TaskTypes.Risk].includes(type);
    if (solved === null && solvableType) {
      setSolved(solvedDefaultValue || false);
    } else if (solved !== null && !solvableType) {
      setSolved(null);
    }
    setSelectedType(type);
  };

  return {
    description,
    setDescription,
    selectedType,
    setSelectedType: handleSetSelectedType,
    solved,
    setSolved,
    color,
    shorthand,
    setDefaultValues,
    isEditing,
    setIsEditing: handleEditing,
    hasChanges,
  };
};
