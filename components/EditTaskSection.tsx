import { Button, Checkbox, Icon } from "@equinor/eds-core-react";
import { solveTask, deleteTask } from "@/services/taskApi";
import { useAccount, useMsal } from "@azure/msal-react";
import { useMutation, useQueryClient } from "react-query";

import { EditTaskTextField } from "./EditTaskTextField";
import { delete_to_trash } from "@equinor/eds-icons";
import { notifyOthers } from "@/services/notifyOthers";
import { Task } from "@/types/Task";
import { unknownErrorToString } from "@/utils/isError";
import { useStoreDispatch } from "@/hooks/storeHooks";
import { NodeDataApi } from "@/types/NodeDataApi";
import { TaskTypes } from "types/TaskTypes";
import { getTaskShorthand } from "utils/getTaskShorthand";
import { useProjectId } from "@/hooks/useProjectId";

export function EditTaskSection(props: {
  task: Task;
  object: NodeDataApi;
  canEdit: boolean;
}) {
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
    }) => solveTask(projectId, node.id, solvedTask.id ?? "", solved),
    {
      onSuccess(_data, variables) {
        const { solvedTask, solved } = variables;
        void notifyOthers(
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
    (task: Task) => deleteTask(object.projectId, object.id, task.id ?? ""),
    {
      onSuccess() {
        void notifyOthers(
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
      <div style={{ flex: 1 }}>
        <EditTaskTextField
          canEdit={props.canEdit}
          key={task.id}
          task={task}
          vsmObject={object}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        {/* Only show checkbox for Problems and risks */}
        {task &&
        (task.type === TaskTypes.Problem || task.type === TaskTypes.Risk) ? (
          <Checkbox
            key={task.id}
            defaultChecked={task.solved}
            title={`${getToggleActionText(task.type, task.solved ?? false)}`}
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
    case TaskTypes.Problem:
      return solved ? "Mark as unsolved" : "Mark as solved";
    case TaskTypes.Question:
      return solved ? "Mark as unanswered" : "Mark as answered";
    case TaskTypes.Idea:
      return solved ? "Mark as declined" : "Mark as approved";
    case TaskTypes.Risk:
      return solved ? "Mark as unmitigated" : "Mark as mitigated";
    default:
      return "";
  }
}

function getTaskSolvedText(type: TaskTypes | undefined, solved: boolean) {
  switch (type) {
    case TaskTypes.Problem:
      return solved ? "Solved" : "Unsolved";
    case TaskTypes.Question:
      return solved ? "Answered" : "Unanswered";
    case TaskTypes.Idea:
      return solved ? "Approved" : "Declined";
    case TaskTypes.Risk:
      return solved ? "Mitigated" : "Unmitigated";
    default:
      return "";
  }
}

function getTaskTypeText(type: TaskTypes | undefined) {
  switch (type) {
    case TaskTypes.Problem:
      return "Problem";
    case TaskTypes.Question:
      return "Question";
    case TaskTypes.Idea:
      return "Idea";
    case TaskTypes.Risk:
      return "Risk";
    default:
      return "Task";
  }
}
