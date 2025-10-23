import { useStoreDispatch } from "@/hooks/storeHooks";
import { useProjectId } from "@/hooks/useProjectId";
import { notifyOthers } from "@/services/notifyOthers";
import {
  createTask,
  deleteTask,
  linkTask,
  unlinkTask,
  updateTask,
} from "@/services/taskApi";
import { Task } from "@/types/Task";
import { TaskTypes } from "@/types/TaskTypes";
import { unknownErrorToString } from "@/utils/isError";
import { useMutation, useQueryClient } from "react-query";
import { useUserAccount } from "../hooks/useUserAccount";

export const usePQIRMutations = () => {
  const { projectId } = useProjectId();
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const account = useUserAccount();

  const createPQIR = useMutation(
    ({
      description,
      selectedType,
      solved,
      selectedNodeId,
    }: {
      description: string;
      selectedType: TaskTypes;
      solved: boolean | null;
      selectedNodeId: string;
    }) => {
      dispatch.setSnackMessage("⏳ Creating PQIR...");
      return createTask(
        {
          description: description,
          type: selectedType,
          solved: solved,
        },
        projectId,
        selectedNodeId
      );
    },
    {
      onSuccess: () => {
        dispatch.setSnackMessage("✅ PQIR created!");
        void notifyOthers(`Created a new PQIR`, projectId, account);
        return queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const linkPQIR = useMutation(
    ({
      selectedNodeId,
      pqirId,
    }: {
      selectedNodeId: string;
      pqirId: string;
    }) => {
      dispatch.setSnackMessage("⏳ Linking PQIR...");
      return linkTask(projectId, selectedNodeId, pqirId);
    },
    {
      onSuccess: () => {
        dispatch.setSnackMessage("✅ PQIR linked!");
        void notifyOthers("Added a PQIR to a card", projectId, account);
        return queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const unlinkPQIR = useMutation(
    ({
      selectedNodeId,
      pqirId,
    }: {
      selectedNodeId: string;
      pqirId: string;
    }) => {
      dispatch.setSnackMessage("⏳ Unlinking PQIR...");
      return unlinkTask(projectId, selectedNodeId, pqirId);
    },
    {
      onSuccess() {
        dispatch.setSnackMessage("⛔️ PQIR removed from card!");
        void notifyOthers("Removed PQIR from a card", projectId, account);
        return queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const updatePQIR = useMutation(
    ({
      pqir,
      selectedNodeId,
      isSolvedSingleCard,
    }: {
      pqir: Task;
      selectedNodeId: string;
      isSolvedSingleCard: boolean;
    }) => {
      dispatch.setSnackMessage("⏳ Updating PQIR...");

      return updateTask(
        {
          ...pqir,
          isSolvedSingleCard,
        },
        projectId,
        pqir.id,
        selectedNodeId
      );
    },
    {
      onSuccess: () => {
        dispatch.setSnackMessage("✅ PQIR updated!");
        void notifyOthers("Updated a PQIR", projectId, account);
        return queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const deletePQIR = useMutation(
    ({
      pqirId,
      selectedNodeId,
    }: {
      pqirId: string;
      selectedNodeId: string;
    }) => {
      dispatch.setSnackMessage("⏳ Deleting PQIR...");
      return deleteTask(projectId, selectedNodeId, pqirId);
    },
    {
      onSuccess: () => {
        dispatch.setSnackMessage("🗑️ PQIR deleted!");
        void notifyOthers("Deleted a PQIR", projectId, account);
        return queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  return { createPQIR, linkPQIR, unlinkPQIR, updatePQIR, deletePQIR };
};
