import React, { useState } from "react";
import { redo, undo } from "@equinor/eds-icons";
import { ButtonWrapper } from "@/components/ButtonWrapper";
import { useProjectId } from "@/hooks/useProjectId";
import { useMutation, useQueryClient } from "react-query";
import { redoProcess, undoProcess } from "@/services/undoRedoApi";
import { useAccount, useMsal } from "@azure/msal-react";
import { useStoreDispatch } from "@/hooks/storeHooks";
import { unknownErrorToString } from "@/utils/isError";
import { notifyOthers } from "@/services/notifyOthers";
import styles from "./UndoRedoButton.module.scss";

const undoStyle: React.CSSProperties = {
  borderRight: "1px solid #F7F7F7",
};

export const UndoRedoButton = () => {
  const [isUndoDisabled, setisUndoDisabled] = useState(false);
  const [isRedoDisabled, setisRedoDisabled] = useState(false);
  const { projectId } = useProjectId();
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const undoMutation = useMutation(
    (payload: any) => {
      return undoProcess(projectId, account?.username ?? "", payload);
    },
    {
      onSuccess: (response) => {
        dispatch.setSnackMessage("✅ Undo Done!");
        setisUndoDisabled(response.data.disableUndo);
        notifyOthers("Updated the process", projectId, account);
        queryClient.invalidateQueries(["graph", projectId]);
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );
  const redoMutation = useMutation(
    (payload: any) => {
      return redoProcess(projectId, account?.username ?? "", payload);
    },
    {
      onSuccess: (response) => {
        dispatch.setSnackMessage("✅ Redo Done!");
        setisRedoDisabled(response.data.disableUndo);
        notifyOthers("Updated the process", projectId, account);
        queryClient.invalidateQueries(["graph", projectId]);
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );
  const handleUndo = () => {
    undoMutation.mutate({
      userId: account?.username,
    });
  };

  const handleRedo = () => {
    redoMutation.mutate({
      userId: account?.username,
    });
  };

  return (
    <div className={styles.undoRedoContainer}>
      <ButtonWrapper
        icon={undo}
        onClick={handleUndo}
        title="Undo"
        styles={undoStyle}
        disabled={isUndoDisabled}
      />
      <ButtonWrapper
        icon={redo}
        onClick={handleRedo}
        title="Redo"
        disabled={isRedoDisabled}
      />
    </div>
  );
};
