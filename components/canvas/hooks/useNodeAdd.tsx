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
import { useUserAccount } from "./useUserAccount";

export type AddNodeParams = {
  parentId: string;
  type: NodeTypes;
  position: Position;
};

export const useNodeAdd = (projectId: string) => {
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const account = useUserAccount();

  return useMutation(
    (params: AddNodeParams) => {
      const { parentId, type, position } = params;
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
