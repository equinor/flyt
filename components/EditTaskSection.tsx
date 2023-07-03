import { Button, Checkbox, Icon } from "@equinor/eds-core-react";
import { solveTask, deleteTask } from "../services/taskApi";
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
import { getTaskShorthand } from "utils/getTaskShorthand";

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
    }) => solveTask(id, card.id, solvedTask.id, solved),
    {
      onSuccess(_data, variables) {
        const { solvedTask, solved } = variables;
        notifyOthers(
          ` ${getTaskSolvedText(solvedTask.type, solved)} a ${getTaskTypeText(
            solvedTask.type
          )}`,
          id,
          account
        );
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const taskDeleteMutation = useMutation(
    (task: taskObject) => deleteTask(object.projectId, object.id, task.id),
    {
      onSuccess() {
        notifyOthers(
          `Removed ${getTaskTypeText(task.type)} from a card`,
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
      <EditTaskTextField disabled={!props.canEdit} key={task.id} task={task} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        {/* Only show checkbox for Problems and risks */}
        {task &&
        (task.type === vsmTaskTypes.problem ||
          task.type === vsmTaskTypes.risk) ? (
          <Checkbox
            key={task.id}
            defaultChecked={task.solved}
            title={`${getToggleActionText(task.type, task.solved)}`}
            disabled={!props.canEdit}
            onChange={() => {
              solveTaskMutation.mutate({
                card: object,
                solvedTask: task,
                solved: !task.solved,
              });
              dispatch.setSnackMessage(
                `Marked ${getTaskShorthand(task)} as ${getTaskSolvedText(
                  task.type,
                  !task.solved
                )}`
              );
            }}
          />
        ) : null}
        <Button
          title={`Delete selected ${getTaskTypeText(task.type)}`}
          disabled={!task || !props.canEdit}
          variant={"ghost_icon"}
          color={"danger"}
          onClick={() => {
            taskDeleteMutation.mutate(task);
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

function getTaskTypeText(type: vsmTaskTypes) {
  switch (type) {
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
