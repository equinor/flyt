import { Button, Checkbox, Icon } from "@equinor/eds-core-react";
import { solveTask, deleteTask } from "../services/taskApi";
import { useAccount, useMsal } from "@azure/msal-react";
import { useMutation, useQueryClient } from "react-query";

import { EditTaskTextField } from "./EditTaskTextField";
import { delete_to_trash } from "@equinor/eds-icons";
import { notifyOthers } from "../services/notifyOthers";
import { Task } from "../types/Task";
import { unknownErrorToString } from "../utils/isError";
import { useStoreDispatch } from "../hooks/storeHooks";
import { NodeDataApi } from "../types/NodeDataApi";
import { TaskTypes } from "types/TaskTypes";
import { getTaskShorthand } from "utils/getTaskShorthand";
import { useProjectId } from "../hooks/useProjectId";

export function EditTaskSection(props: {
  task: Task;
  object: NodeDataApi;
  canEdit: boolean;
}): JSX.Element {
  const { task, object } = props;
  const dispatch = useStoreDispatch();

  const { projectId } = useProjectId();
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const queryClient = useQueryClient();

  const solveTaskMutation = useMutation(
    ({
      node,
      solvedTask,
      solved,
    }: {
      node: NodeDataApi;
      solvedTask: Task;
      solved: boolean;
    }) => solveTask(projectId, node.id, solvedTask.id, solved),
    {
      onSuccess(_data, variables) {
        const { solvedTask, solved } = variables;
        notifyOthers(
          ` ${getTaskSolvedText(solvedTask.type, solved)} a ${getTaskTypeText(
            solvedTask.type
          )}`,
          projectId,
          account
        );
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const taskDeleteMutation = useMutation(
    (task: Task) => deleteTask(object.projectId, object.id, task.id),
    {
      onSuccess() {
        notifyOthers(
          `Removed ${getTaskTypeText(task.type)} from a card`,
          projectId,
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
        key={task.id}
        task={task}
        vsmObject={object}
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
        (task.type === TaskTypes.problem || task.type === TaskTypes.risk) ? (
          <Checkbox
            key={task.id}
            defaultChecked={task.solved}
            title={`${getToggleActionText(task.type, task.solved)}`}
            disabled={!props.canEdit}
            onChange={() => {
              solveTaskMutation.mutate({
                node: object,
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

function getToggleActionText(type: TaskTypes, solved: boolean) {
  switch (type) {
    case TaskTypes.problem:
      return solved ? "Mark as unsolved" : "Mark as solved";
    case TaskTypes.question:
      return solved ? "Mark as unanswered" : "Mark as answered";
    case TaskTypes.idea:
      return solved ? "Mark as declined" : "Mark as approved";
    case TaskTypes.risk:
      return solved ? "Mark as unmitigated" : "Mark as mitigated";
    default:
      return "";
  }
}

function getTaskSolvedText(type: TaskTypes, solved: boolean) {
  switch (type) {
    case TaskTypes.problem:
      return solved ? "Solved" : "Unsolved";
    case TaskTypes.question:
      return solved ? "Answered" : "Unanswered";
    case TaskTypes.idea:
      return solved ? "Approved" : "Declined";
    case TaskTypes.risk:
      return solved ? "Mitigated" : "Unmitigated";
    default:
      return "";
  }
}

function getTaskTypeText(type: TaskTypes) {
  switch (type) {
    case TaskTypes.problem:
      return "Problem";
    case TaskTypes.question:
      return "Question";
    case TaskTypes.idea:
      return "Idea";
    case TaskTypes.risk:
      return "Risk";
    default:
      return "Task";
  }
}
