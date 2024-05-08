import { useMutation, useQueryClient } from "react-query";
import { Position } from "reactflow";
import { NodeTypes } from "types/NodeTypes";
import { useStoreDispatch } from "../../../hooks/storeHooks";
import {
  addVertice,
  addVerticeLeft,
  addVerticeRight,
} from "../../../services/graphApi";
import { notifyOthers } from "../../../services/notifyOthers";
import { unknownErrorToString } from "../../../utils/isError";
import { useProjectId } from "../../../hooks/useProjectId";
import { useUserAccount } from "./useUserAccount";

export type NodeAddParams = {
  parentId: string;
  type: NodeTypes;
  position: Position;
};

export const useNodeAdd = () => {
  const { projectId } = useProjectId();
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const account = useUserAccount();

  return useMutation(
    ({ parentId, type, position }: NodeAddParams) => {
      dispatch.setSnackMessage("⏳ Adding new card...");
      switch (position) {
        case Position.Left:
          return addVerticeLeft({ type }, projectId, parentId);
        case Position.Right:
          return addVerticeRight({ type }, projectId, parentId);
        default:
          return addVertice({ type }, projectId, parentId);
      }
    },
    {
      onSuccess: () => {
        dispatch.setSnackMessage("✅ Card added!");
        notifyOthers("Added a new card", projectId, account);
        queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );
};
