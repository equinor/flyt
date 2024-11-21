import { useStoreDispatch } from "@/hooks/storeHooks";
import { useProjectId } from "@/hooks/useProjectId";
import { notifyOthers } from "@/services/notifyOthers";
import {
  createTask,
  linkTask,
  unlinkTask,
  updateTask,
} from "@/services/taskApi";
import { NodeDataCommon } from "@/types/NodeData";
import { Task } from "@/types/Task";
import { unknownErrorToString } from "@/utils/isError";
import { useMutation, useQueryClient } from "react-query";
import { useUserAccount } from "../hooks/useUserAccount";
import { TaskTypes } from "@/types/TaskTypes";
import { useEffect, useState } from "react";
import { getTaskColor } from "@/utils/getTaskColor";
import { getTaskShorthand } from "@/utils/getTaskShorthand";

export const usePQIR = (pqir: Task | null, selectedNode: NodeDataCommon) => {
  const { projectId } = useProjectId();
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const account = useUserAccount();
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
      setSolved(solvedDefaultValue);
    } else if (solved !== null && !solvableType) {
      setSolved(null);
    }
    setSelectedType(type);
  };

  const createPQIR = useMutation(
    () => {
      dispatch.setSnackMessage("⏳ Creating PQIR...");
      return createTask(
        {
          description: description,
          type: selectedType,
          solved: solved,
        },
        selectedNode.projectId,
        selectedNode.id
      );
    },
    {
      onSuccess: () => {
        setIsEditing(false);
        dispatch.setSnackMessage("✅ QIPR created!");
        void notifyOthers(`Created a new QIPR`, projectId, account);
        return queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const linkPQIR =
    pqir &&
    useMutation(
      () => {
        dispatch.setSnackMessage("⏳ Linking PQIR...");
        return linkTask(projectId, selectedNode.id, pqir.id);
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          dispatch.setSnackMessage("✅ QIPR linked!");
          void notifyOthers("Added a QIPR to a card", projectId, account);
          return queryClient.invalidateQueries();
        },
        onError: (e: Error | null) =>
          dispatch.setSnackMessage(unknownErrorToString(e)),
      }
    );

  const unlinkPQIR =
    pqir &&
    useMutation(
      () => {
        dispatch.setSnackMessage("⏳ Unlinking PQIR...");
        return unlinkTask(projectId, selectedNode.id, pqir.id);
      },
      {
        onSuccess() {
          setIsEditing(false);
          dispatch.setSnackMessage("✅ QIPR unlinked!");
          void notifyOthers("Removed QIPR from a card", projectId, account);
          return queryClient.invalidateQueries();
        },
        onError: (e: Error | null) =>
          dispatch.setSnackMessage(unknownErrorToString(e)),
      }
    );

  const updatePQIR =
    pqir &&
    useMutation(
      () => {
        dispatch.setSnackMessage("⏳ Updating PQIR...");
        return updateTask(
          {
            ...pqir,
            description: description,
            type: selectedType,
            solved: solved,
          },
          projectId,
          pqir.id,
          selectedNode.id
        );
      },
      {
        onSuccess: () => {
          pqir.solved !== solved && setIsEditing(false);
          dispatch.setSnackMessage("✅ QIPR updated!");
          void notifyOthers("Updated a QIPR", projectId, account);
          return queryClient.invalidateQueries();
        },
        onError: (e: Error | null) =>
          dispatch.setSnackMessage(unknownErrorToString(e)),
      }
    );

  return {
    createPQIR,
    linkPQIR,
    unlinkPQIR,
    updatePQIR,
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
