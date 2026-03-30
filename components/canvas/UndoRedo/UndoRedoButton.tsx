import React, { useEffect, useState } from "react";
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
import { useProjectQuery } from "@/hooks/useProjectQuery";

const undoStyle: React.CSSProperties = {
  borderRight: "1px solid #F7F7F7",
};

export const UndoRedoButton = () => {
  const { projectId } = useProjectId();
  const { project } = useProjectQuery(projectId);
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const [isUndoDisabled, setisUndoDisabled] = useState(
    project?.undoRedoStatus?.disableUndo ?? true
  );
  const [isRedoDisabled, setisRedoDisabled] = useState(
    project?.undoRedoStatus?.disableRedo ?? true
  );

  useEffect(() => {
    setisUndoDisabled(project?.undoRedoStatus?.disableUndo ?? true);
    setisRedoDisabled(project?.undoRedoStatus?.disableRedo ?? true);
  }, [project]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isUndoDisabled && isRedoDisabled) return;
      if (event.ctrlKey) {
        if (!isUndoDisabled && event.key === "z") handleUndo();
        else if (!isRedoDisabled && event.key === "y") handleRedo();
      }
      if (event.metaKey) {
        if (!isRedoDisabled && event.shiftKey && event.key === "z")
          handleRedo();
        else if (!isUndoDisabled && !event.shiftKey && event.key === "z")
          handleUndo();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isUndoDisabled, isRedoDisabled]);

  const undoMutation = useMutation(
    () => {
      return undoProcess(projectId);
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
    () => {
      return redoProcess(projectId);
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
    undoMutation.mutate();
  };

  const handleRedo = () => {
    redoMutation.mutate();
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
