import { Button, Checkbox, Icon } from "@equinor/eds-core-react";
import { solveTask, unlinkTask } from "../services/taskApi";
import { useAccount, useMsal } from "@azure/msal-react";
import { useMutation, useQueryClient } from "react-query";

import { EditTaskTextField } from "./EditTaskTextField";
import React from "react";
import { delete_to_trash } from "@equinor/eds-icons";
import { notifyOthers } from "../services/notifyOthers";
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

  const solveTaskMutation = useMutation(
    ({
      card,
      solvedTask,
      solved,
    }: {
      card: vsmObject;
      solvedTask: taskObject;
      solved: boolean;
    }) => solveTask(card.id, solvedTask.vsmTaskID, solved),
    {
      onSuccess(_data, variables) {
        const { solvedTask, solved } = variables;
        notifyOthers(
          ` ${getTaskSolvedText(
            solvedTask.fkTaskType,
            solved
          )} a ${getTaskTypeText(solvedTask.fkTaskType)}`,
          id,
          account
        );
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const taskUnlinkMutation = useMutation(
    (task: taskObject) => unlinkTask(object.id, task.vsmTaskID),
    {
      onSuccess() {
        notifyOthers(
          `Removed ${getTaskTypeText(task.fkTaskType)} from a card`,
          id,
          account
        );
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
        {/* Only show checkbox for Problems and risks */}
        {task &&
        (task.fkTaskType === vsmTaskTypes.problem ||
          task.fkTaskType === vsmTaskTypes.risk) ? (
          <Checkbox
            key={task.vsmTaskID}
            defaultChecked={task.solved}
            title={`${getToggleActionText(task.fkTaskType, task.solved)}`}
            disabled={!props.canEdit}
            onChange={() => {
              solveTaskMutation.mutate({
                card: object,
                solvedTask: task,
                solved: !task.solved,
              });
              dispatch.setSnackMessage(
                `Marked ${task.displayIndex} as ${getTaskSolvedText(
                  task.fkTaskType,
                  !task.solved
                )}`
              );
            }}
          />
        ) : null}
        <Button
          title={`Delete selected ${getTaskTypeText(task.fkTaskType)}`}
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
      return solved ? "Mark as unmitigated" : "Mark as mitigated";
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
      return solved ? "Mitigated" : "Unmitigated";
    default:
      return "";
  }
}

function getTaskTypeText(fkTaskType: vsmTaskTypes) {
  switch (fkTaskType) {
    case vsmTaskTypes.problem:
      return "Problem";
    case vsmTaskTypes.question:
      return "Question";
    case vsmTaskTypes.idea:
      return "Idea";
    case vsmTaskTypes.risk:
      return "Risk";
    default:
      return "Task";
  }
}
