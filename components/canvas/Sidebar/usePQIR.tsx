import { useStoreDispatch } from "@/hooks/storeHooks";
import { useProjectId } from "@/hooks/useProjectId";
import { notifyOthers } from "@/services/notifyOthers";
import {
  createTask,
  deleteTask,
  linkTask,
  unlinkTask,
} from "@/services/taskApi";
import { NodeDataCommon } from "@/types/NodeData";
import { Task } from "@/types/Task";
import { unknownErrorToString } from "@/utils/isError";
import { useMutation, useQueryClient } from "react-query";
import { useUserAccount } from "../hooks/useUserAccount";
import { TaskTypes } from "@/types/TaskTypes";
import { useState } from "react";
import { getTaskColor } from "@/utils/getTaskColor";
import { getTaskShorthand } from "@/utils/getTaskShorthand";

export const usePQIR = (pqir: Task | null, selectedNode: NodeDataCommon) => {
  const { projectId } = useProjectId();
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const account = useUserAccount();

  const solvedDefaultValue = !pqir ? false : pqir.solved;
  const color = getTaskColor(pqir?.type);
  const shorthand = getTaskShorthand(pqir || undefined);

  const [description, setDescription] = useState(pqir?.description || "");
  const [selectedType, setSelectedType] = useState(
    pqir?.type || TaskTypes.Problem
  );
  const [solved, setSolved] = useState(solvedDefaultValue);

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
          dispatch.setSnackMessage("✅ QIPR unlinked!");
          void notifyOthers("Removed QIPR from a card", projectId, account);
          return queryClient.invalidateQueries();
        },
        onError: (e: Error | null) =>
          dispatch.setSnackMessage(unknownErrorToString(e)),
      }
    );

  const deletePQIR =
    pqir &&
    useMutation(
      () => {
        dispatch.setSnackMessage("⏳ Deleting PQIR...");
        return deleteTask(projectId, selectedNode.id, pqir.id);
      },
      {
        onSuccess() {
          dispatch.setSnackMessage("🗑️ QIPR deleted!");
          void notifyOthers("Deleted a PQIR", projectId, account);
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
    deletePQIR,
    description,
    setDescription,
    selectedType,
    setSelectedType: handleSetSelectedType,
    solved,
    setSolved,
    color,
    shorthand,
  };
};
