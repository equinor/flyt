import { Button, Checkbox, Icon, Tooltip } from "@equinor/eds-core-react";
import { getTaskTypes, patchTask, unlinkTask } from "../services/taskApi";
import { useAccount, useMsal } from "@azure/msal-react";
import { useMutation, useQueryClient } from "react-query";

import { EditTaskTextField } from "./EditTaskTextField";
import React from "react";
import { TooltipImproved } from "./TooltipImproved";
import { delete_to_trash } from "@equinor/eds-icons";
import { notifyOthers } from "../services/notifyOthers";
import styles from "./VSMCanvas.module.scss";
import { taskObject } from "../interfaces/taskObject";
import { unknownErrorToString } from "../utils/isError";
import { useRouter } from "next/router";
import { useStoreDispatch } from "../hooks/storeHooks";
import { vsmObject } from "../interfaces/VsmObject";
import { vsmTaskTypes } from "types/vsmTaskTypes";

export function EditTaskSection(props: {
  task: taskObject;
  object: vsmObject;
  canEdit: boolean;
}): JSX.Element {
  const { task, object } = props;
  const dispatch = useStoreDispatch();

  const router = useRouter();
  const { id } = router.query;
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const queryClient = useQueryClient();

  const patchTaskMutation = useMutation(
    (patchedTask: taskObject) => patchTask(patchedTask),
    {
      onSuccess() {
        // notifyOthers("Deleted a task", id, account);
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const taskUnlinkMutation = useMutation(
    (task: taskObject) => unlinkTask(object.vsmObjectID, task.vsmTaskID),
    {
      onSuccess() {
        notifyOthers("Removed Q/I/P from a card", id, account);
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  return (
    <div style={{ display: "flex" }}>
      {/*  Important to have a key so that it triggers a re-render when needed */}
      <EditTaskTextField
        disabled={!props.canEdit}
        key={task.vsmTaskID}
        task={task}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        <Checkbox
          key={task.vsmTaskID}
          defaultChecked={task.solved}
          title={`${getToggleActionText(task.fkTaskType, task.solved)}`}
          disabled={!props.canEdit}
          onChange={() => {
            patchTaskMutation.mutate({ ...task, solved: !task.solved });
            dispatch.setSnackMessage(
              `Marked ${task.displayIndex} as ${getTaskSolvedText(
                task.fkTaskType,
                !task.solved
              )}`
            );
          }}
        />
        <Button
          title={`Delete selected QIP`}
          disabled={!task || !props.canEdit}
          variant={"ghost_icon"}
          color={"danger"}
          onClick={() => {
            taskUnlinkMutation.mutate(task);
          }}
        >
          <Icon data={delete_to_trash} size={24} />
        </Button>
      </div>
    </div>
  );
}

function getToggleActionText(type: vsmTaskTypes, solved: boolean) {
  switch (type) {
    case vsmTaskTypes.problem:
      return solved ? "Mark as unsolved" : "Mark as solved";
    case vsmTaskTypes.question:
      return solved ? "Mark as unanswered" : "Mark as answered";
    case vsmTaskTypes.idea:
      return solved ? "Mark as declined" : "Mark as approved";
    case vsmTaskTypes.risk:
      return solved ? "Mark as not handled" : "Mark as handled";
    default:
      return "";
  }
}

function getTaskSolvedText(type: vsmTaskTypes, solved: boolean) {
  switch (type) {
    case vsmTaskTypes.problem:
      return solved ? "Solved" : "Unsolved";
    case vsmTaskTypes.question:
      return solved ? "Answered" : "Unanswered";
    case vsmTaskTypes.idea:
      return solved ? "Approved" : "Declined";
    case vsmTaskTypes.risk:
      return solved ? "Handled" : "Not handled";
    default:
      return "";
  }
}
