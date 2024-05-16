import { useMutation, useQueryClient } from "react-query";
import { useStoreDispatch } from "../../../hooks/storeHooks";
import { useProjectId } from "../../../hooks/useProjectId";
import { deleteEdge } from "../../../services/graphApi";
import { notifyOthers } from "../../../services/notifyOthers";
import { unknownErrorToString } from "../../../utils/isError";
import { useUserAccount } from "./useUserAccount";

export type EdgeDeleteParams = {
  edgeId: string;
};

export const useEdgeDelete = () => {
  const { projectId } = useProjectId();
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const account = useUserAccount();

  return useMutation(
    ({ edgeId }: EdgeDeleteParams) => {
      dispatch.setSnackMessage("⏳ Deleting line...");
      return deleteEdge(edgeId, projectId);
    },
    {
      onSuccess: () => {
        dispatch.setSnackMessage("🗑️ Line deleted!");
        notifyOthers("Deleted a line", projectId, account);
        queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );
};
