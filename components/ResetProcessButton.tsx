import { Button, Icon } from "@equinor/eds-core-react";
import React, { useState } from "react";
import { getProject, resetProcess } from "services/projectApi";
import { useAccount, useMsal } from "@azure/msal-react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { ErrorDialog } from "./ErrorDialog";
import { ResetProcessDialog } from "./ResetProcessDialog";
import { getMyAccess } from "utils/getMyAccess";
import { notifyOthers } from "services/notifyOthers";
import { restore } from "@equinor/eds-icons";
import { useRouter } from "next/router";

export const ResetProcessButton = () => {
  const { id } = useRouter().query;
  const { data: process } = useQuery(["project", id], () => getProject(id));
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const myAccess = getMyAccess(process, account);

  const queryClient = useQueryClient();
  const resetProcessMutation = useMutation(() => resetProcess(id), {
    onSuccess: () => {
      notifyOthers("Reset the process", id, account);
    },
    onError: () => setShowErrorDialog(true),
    onSettled: () => queryClient.invalidateQueries(),
  });
  const [showResetScrim, setShowResetScrim] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  //Only show the reset-button if:
  // 1. This is a to-be process
  const isTobeProcess = !!process?.currentProcessId;
  // 2. The user have the right to edit the process
  const userCanEdit = false;

  if (!isTobeProcess || !userCanEdit) return null;

  return (
    <>
      <ResetProcessDialog
        visible={showResetScrim}
        onClose={() => setShowResetScrim(false)}
        onReset={() => {
          resetProcessMutation.mutate();
          setShowResetScrim(false);
        }}
      />
      <ErrorDialog
        visible={showErrorDialog}
        error={resetProcessMutation.error}
        onClose={() => setShowErrorDialog(false)}
      />
      <Button
        variant="outlined"
        style={{
          position: "absolute",
          left: 0,
          margin: 24,
        }}
        onClick={() => {
          setShowResetScrim(true);
        }}
      >
        <Icon data={restore} />
        Reset page
      </Button>
    </>
  );
};
